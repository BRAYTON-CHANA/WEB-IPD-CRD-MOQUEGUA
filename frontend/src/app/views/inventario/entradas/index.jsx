import React, { useState, useEffect, useCallback } from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import InventarioSidebar from '../InventarioSidebar';
import { db } from '@/shared/api';
import EntradasTable from './components/EntradasTable';
import EntradaForm from './components/EntradaForm';
import { EntradaDetalleModal } from './components/modals/EntradaDetalleModal';

const COLUMNS = [
  'ID_ENTRADA', 'CODIGO_ENTRADA', 'TIPO_ENTRADA', 'NRO_NEA', 'FECHA_EMISION', 'FECHA_DOCUMENTO',
  'NOTAS', 'ACTIVO', 'CREATED_AT', 'ID_ALMACEN_DESTINO', 'ALMACEN_NOMBRE', 'ALMACEN_TIPO',
  'ID_INFRAESTRUCTURA', 'INFRAESTRUCTURA_NOMBRE', 'ID_PROVEEDOR', 'PROVEEDOR_NOMBRE',
  'PROVEEDOR_RUC', 'PROVEEDOR_TELEFONO', 'ID_EXTERNO', 'EXTERNO_NOMBRE', 'EXTERNO_TIPO',
  'ID_EMPLEADO_RECEPTOR', 'EMPLEADO_NOMBRE', 'EMPLEADO_ABREV', 'CANTIDAD_ACTIVOS', 'TOTAL_ITEMS'
];

const COLUMNS_LINEAS = [
  'ID_ENTRADA_ACTIVO', 'ID_ENTRADA', 'ID_ACTIVO_CONTROL', 'CANTIDAD', 'PRECIO_UNITARIO',
  'ESTADO_CONSERVADO', 'OBSERVACIONES', 'ACTIVO'
];

function EntradasPage() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [selectedEntrada, setSelectedEntrada] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [entradaDetalle, setEntradaDetalle] = useState(null);

  const loadEntradas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const PAGE_SIZE = 1000;
      let allEntradas = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const result = await db.selectWithLimit('vw_entradas_completo', PAGE_SIZE, offset, {}, COLUMNS);
        const batch = result || [];
        allEntradas = [...allEntradas, ...batch];

        if (batch.length < PAGE_SIZE) {
          hasMore = false;
        } else {
          offset += PAGE_SIZE;
        }
      }

      setEntradas(allEntradas);
    } catch (err) {
      setError('Error al cargar entradas: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEntradas(); }, [loadEntradas]);

  const handleCreate = () => { setSelectedEntrada(null); setSaveError(null); setView('form'); };
  const handleBack = () => { setSelectedEntrada(null); setView('list'); };
  
  const handleView = (entrada) => {
    setEntradaDetalle(entrada);
    setShowDetalle(true);
  };

  const handleDelete = async (entrada) => {
    // PASO 1: Confirmación inicial
    const paso1 = confirm(`¿Estás seguro de eliminar la entrada "${entrada.CODIGO_ENTRADA}"?`);
    if (!paso1) return;
    
    // PASO 2: Preguntar sobre activos
    const eliminarActivos = confirm(
      `¿Deseas eliminar también los activos asociados a esta entrada?\n\n` +
      `• SI = Eliminar entrada Y todos sus activos\n` +
      `• NO = Solo eliminar la entrada (los activos permanecen en inventario)\n\n` +
      `Presiona Aceptar para eliminar TODO, o Cancelar para solo eliminar la entrada.`
    );
    
    // PASO 3 (solo si eligió eliminar activos): Confirmación de riesgo
    if (eliminarActivos) {
      const paso3 = confirm(
        `⚠️ ADVERTENCIA ⚠️\n\n` +
        `Eliminar los activos puede causar errores en el inventario si estos han sido:\n` +
        `• Movidos a otros almacenes\n` +
        `• Asignados a empleados\n` +
        `• Incluidos en otras operaciones\n\n` +
        `¿Estás COMPLETAMENTE SEGURO de eliminar los activos?\n\n` +
        `Presiona Aceptar para continuar con la eliminación total.`
      );
      if (!paso3) return;
    }
    
    try {
      if (eliminarActivos) {
        // Obtener activos asociados a esta entrada
        const lineas = await db.select('ENTRADAS_ACTIVO', { ID_ENTRADA: entrada.ID_ENTRADA }, ['ID_ACTIVO_CONTROL']);
        
        // Eliminar cada activo (control)
        for (const linea of lineas) {
          if (linea.ID_ACTIVO_CONTROL) {
            try {
              await db.delete('ACTIVOS_CONTROL', linea.ID_ACTIVO_CONTROL, 'ID_ACTIVO_CONTROL');
            } catch (e) {
              console.error('Error al eliminar activo', linea.ID_ACTIVO_CONTROL, e);
            }
          }
        }
      }
      
      // Eliminar la entrada (las líneas ENTRADAS_ACTIVO se eliminan en cascada si hay FK)
      await db.delete('ENTRADAS', entrada.ID_ENTRADA, 'ID_ENTRADA');
      
      alert(`Entrada "${entrada.CODIGO_ENTRADA}" eliminada correctamente.`);
      loadEntradas();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleSave = async ({ cabecera, lineas }) => {
    setSaving(true);
    setSaveError(null);
    
    let idEntrada = null;
    const activosCreados = []; // Para trackear IDs de activos creados (para rollback)
    const identidadesCreadas = []; // Para trackear IDs de identidades creadas (para rollback)
    
    try {
      if (selectedEntrada) {
        // EDITAR - Solo cabecera por ahora
        await db.update('ENTRADAS', selectedEntrada.ID_ENTRADA, cabecera, 'ID_ENTRADA');
        // TODO: Sincronizar líneas (añadir/modificar/eliminar)
      } else {
        // ==========================================================
        // FLUJO CREAR ENTRADA - 4 PASOS TRANSACCIONALES
        // ==========================================================
        
        // ========== PASO 1: Crear ENTRADA (cabecera) ==========
        console.log('[PASO 1] Creando entrada...');
        const nuevaEntrada = await db.insert('ENTRADAS', { ...cabecera, ACTIVO: true });
        idEntrada = Array.isArray(nuevaEntrada) ? nuevaEntrada[0].ID_ENTRADA : nuevaEntrada.ID_ENTRADA;
        console.log('[PASO 1] Entrada creada ID:', idEntrada);
        
        // ========== PASO 2: Crear Activos (CONTROL) ==========
        console.log('[PASO 2] Creando activos...');
        for (const linea of lineas) {
          // 2.1 Crear identidad si es nueva
          let idActivoIdentidad = null;
          if (linea.modoNueva) {
            const identidadPayload = {
              ID_CLASIFICACION: linea.identidad.ID_CLASIFICACION || null,
              MARCA: linea.identidad.MARCA || null,
              MODELO: linea.identidad.MODELO || null,
              COLOR: linea.identidad.COLOR || null,
              DIMENSIONES: linea.identidad.DIMENSIONES || null,
              MATERIAL: linea.identidad.MATERIAL || null,
              COMENTARIOS: linea.identidad.COMENTARIOS || null,
              ACTIVO: true,
            };
            const resultIdentidad = await db.insert('ACTIVOS_IDENTIDAD', identidadPayload);
            idActivoIdentidad = Array.isArray(resultIdentidad) 
              ? resultIdentidad[0].ID_ACTIVO_IDENTIDAD 
              : resultIdentidad.ID_ACTIVO_IDENTIDAD;
            identidadesCreadas.push(idActivoIdentidad);
            console.log('[PASO 2] Identidad creada ID:', idActivoIdentidad);
          } else {
            idActivoIdentidad = linea.identidad.ID_ACTIVO_IDENTIDAD;
          }
          
          // 2.2 Crear control con CONFIRMADO=false (por ahora)
          const controlPayload = {
            ID_ACTIVO_IDENTIDAD: idActivoIdentidad,
            COD_PATRIMONIAL: linea.control.COD_PATRIMONIAL || null,
            NUMERO_SERIAL: linea.control.NUMERO_SERIAL || null,
            ES_ACTIVO_FIJO: linea.control.ES_ACTIVO_FIJO ?? true,
            ESTADO: linea.control.ESTADO || 'Regular',
            CANTIDAD: linea.control.CANTIDAD ?? 1,
            PESO_KG: linea.control.PESO_KG || null,
            ID_GRUPO: linea.control.ID_GRUPO || null,
            CONFIRMADO: false, // No confirmado aún
            EN_PRESTAMO: false,
            ACTIVO: true,
            OBSERVACIONES: linea.control.OBSERVACIONES || null,
            DESCRIPCION: linea.control.DESCRIPCION || null,
            ID_ENTRADA_ACTIVO_ORIGEN: null, // Se actualizará en paso 3
            ID_ALMACEN_ASIGNADO: null, // Se asignará en paso 4
          };
          const resultControl = await db.insert('ACTIVOS_CONTROL', controlPayload);
          const idActivoControl = Array.isArray(resultControl) 
            ? resultControl[0].ID_ACTIVO_CONTROL 
            : resultControl.ID_ACTIVO_CONTROL;
          activosCreados.push(idActivoControl);
          
          // Guardar ID para usar en paso 3
          linea._idActivoControl = idActivoControl;
          linea._idActivoIdentidad = idActivoIdentidad;
          console.log('[PASO 2] Control creado ID:', idActivoControl);
        }
        console.log('[PASO 2] Activos creados:', activosCreados.length);
        
        // ========== PASO 3: Crear ENTRADAS_ACTIVO (líneas) ==========
        console.log('[PASO 3] Creando líneas de entrada...');
        for (const linea of lineas) {
          const entradaActivoPayload = {
            ID_ENTRADA: idEntrada,
            ID_ACTIVO_CONTROL: linea._idActivoControl,
            CANTIDAD: linea.CANTIDAD,
            PRECIO_UNITARIO: linea.PRECIO_UNITARIO || null,
            ESTADO_CONSERVADO: linea.ESTADO_CONSERVADO || 'Bueno',
            OBSERVACIONES: linea.OBSERVACIONES || null,
            ACTIVO: true,
          };
          const resultEntradaActivo = await db.insert('ENTRADAS_ACTIVO', entradaActivoPayload);
          const idEntradaActivo = Array.isArray(resultEntradaActivo) 
            ? resultEntradaActivo[0].ID_ENTRADA_ACTIVO 
            : resultEntradaActivo.ID_ENTRADA_ACTIVO;
          
          // Actualizar el control con el ID_ENTRADA_ACTIVO_ORIGEN
          await db.update('ACTIVOS_CONTROL', linea._idActivoControl, {
            ID_ENTRADA_ACTIVO_ORIGEN: idEntradaActivo,
          }, 'ID_ACTIVO_CONTROL');
          console.log('[PASO 3] Línea creada ID:', idEntradaActivo, '-> Control actualizado');
        }
        console.log('[PASO 3] Líneas creadas:', lineas.length);
        
        // ========== PASO 4: Confirmar Activos ==========
        console.log('[PASO 4] Confirmando activos...');
        for (const linea of lineas) {
          await db.update('ACTIVOS_CONTROL', linea._idActivoControl, {
            CONFIRMADO: true,
            ID_ALMACEN_ASIGNADO: cabecera.ID_ALMACEN_DESTINO,
          }, 'ID_ACTIVO_CONTROL');
          console.log('[PASO 4] Activo confirmado ID:', linea._idActivoControl);
        }
        console.log('[PASO 4] Activos confirmados:', activosCreados.length);
        
        console.log('[ÉXITO] Entrada completa creada exitosamente');
      }
      
      await loadEntradas();
      setView('list');
      setSelectedEntrada(null);
      
    } catch (err) {
      console.error('[ERROR] Error en flujo transaccional:', err);
      setSaveError(err.message);
      
      // ========== ROLLBACK ==========
      console.log('[ROLLBACK] Iniciando limpieza por error...');
      
      if (activosCreados.length > 0) {
        console.log('[ROLLBACK] Eliminando activos creados...');
        for (const id of activosCreados) {
          try {
            await db.delete('ACTIVOS_CONTROL', id, 'ID_ACTIVO_CONTROL');
          } catch (e) {
            console.error('[ROLLBACK] Error al eliminar activo', id, ':', e);
          }
        }
      }
      
      if (identidadesCreadas.length > 0) {
        console.log('[ROLLBACK] Eliminando identidades creadas...');
        for (const id of identidadesCreadas) {
          try {
            await db.delete('ACTIVOS_IDENTIDAD', id, 'ID_ACTIVO_IDENTIDAD');
          } catch (e) {
            console.error('[ROLLBACK] Error al eliminar identidad', id, ':', e);
          }
        }
      }
      
      if (idEntrada) {
        console.log('[ROLLBACK] Eliminando entrada creada...');
        try {
          await db.delete('ENTRADAS', idEntrada, 'ID_ENTRADA');
        } catch (e) {
          console.error('[ROLLBACK] Error al eliminar entrada', idEntrada, ':', e);
        }
      }
      
      console.log('[ROLLBACK] Limpieza completada');
      
    } finally {
      setSaving(false);
    }
  };

  return (
    <LayoutWithSidebar sidebarComponent={InventarioSidebar}>
      <div className="px-6 py-6">
        {view === 'list' ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Entradas</h1>
                <p className="text-sm text-gray-500 mt-0.5">Registro de ingresos al patrimonio institucional</p>
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar entrada
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
                <button onClick={loadEntradas} className="ml-auto text-red-600 underline text-xs">Reintentar</button>
              </div>
            )}

            <EntradasTable
              entradas={entradas}
              loading={loading}
              onView={handleView}
              onDelete={handleDelete}
            />
            
            {showDetalle && entradaDetalle && (
              <EntradaDetalleModal
                entrada={entradaDetalle}
                onClose={() => { setShowDetalle(false); setEntradaDetalle(null); }}
              />
            )}
          </>
        ) : (
          <>
            {saveError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {saveError}
              </div>
            )}
            <EntradaForm
              entrada={selectedEntrada}
              onSave={handleSave}
              onCancel={handleBack}
              saving={saving}
            />
          </>
        )}
      </div>
    </LayoutWithSidebar>
  );
}

export default EntradasPage;
