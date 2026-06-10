import React, { useState, useEffect, useCallback } from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import InventarioSidebar from '../InventarioSidebar';
import { db } from '@/shared/api';
import SalidasTable from './components/SalidasTable';
import SalidaForm from './components/SalidaForm';
import { SalidaDetalleModal } from './components/modals/SalidaDetalleModal';

const COLUMNS = [
  'ID_SALIDA', 'CODIGO_SALIDA', 'TIPO_SALIDA', 'NRO_PECOSA', 'FECHA_EMISION', 'FECHA_DOCUMENTO',
  'NOTAS', 'ACTIVO', 'CREATED_AT', 'ID_ALMACEN_ORIGEN', 'ALMACEN_NOMBRE', 'ALMACEN_TIPO',
  'ID_INFRAESTRUCTURA', 'INFRAESTRUCTURA_NOMBRE', 'ID_EXTERNO', 'EXTERNO_NOMBRE', 'EXTERNO_TIPO',
  'ID_EMPLEADO_ENTREGA', 'EMPLEADO_NOMBRE', 'EMPLEADO_ABREV', 'CANTIDAD_ACTIVOS', 'TOTAL_ITEMS'
];

const COLUMNS_LINEAS = [
  'ID_SALIDA_ACTIVO', 'ID_SALIDA', 'ID_ACTIVO_CONTROL', 'CANTIDAD',
  'ESTADO_CONSERVADO', 'OBSERVACIONES', 'ACTIVO'
];

function SalidasPage() {
  const [salidas, setSalidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [selectedSalida, setSelectedSalida] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [salidaDetalle, setSalidaDetalle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const loadSalidas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const PAGE_SIZE = 1000;
      let allSalidas = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const result = await db.selectWithLimit('vw_salidas_completo', PAGE_SIZE, offset, {}, COLUMNS);
        const batch = result || [];
        allSalidas = [...allSalidas, ...batch];

        if (batch.length < PAGE_SIZE) {
          hasMore = false;
        } else {
          offset += PAGE_SIZE;
        }
      }

      setSalidas(allSalidas);
    } catch (err) {
      setError('Error al cargar salidas: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSalidas(); }, [loadSalidas]);

  const handleCreate = () => {
    setSelectedSalida(null);
    setSaveError(null);
    setView('form');
  };
  
  const handleBack = () => {
    setSelectedSalida(null);
    setView('list');
  };

  const handleView = (salida) => {
    setSalidaDetalle(salida);
    setShowDetalle(true);
  };

  const handleDelete = async (salida) => {
    // PASO 1: Confirmación inicial
    const paso1 = confirm(`¿Estás seguro de eliminar la salida "${salida.CODIGO_SALIDA}"?`);
    if (!paso1) return;

    // PASO 2: Preguntar sobre activos
    const eliminarActivos = confirm(
      `¿Deseas eliminar también los activos asociados a esta salida?\n\n` +
      `• SI = Eliminar salida Y todos sus activos\n` +
      `• NO = Solo eliminar la salida (los activos permanecen en inventario)\n\n` +
      `Presiona Aceptar para eliminar TODO, o Cancelar para solo eliminar la salida.`
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
        // Obtener activos asociados a esta salida
        const lineas = await db.select('SALIDAS_ACTIVO', { ID_SALIDA: salida.ID_SALIDA }, ['ID_ACTIVO_CONTROL']);

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

      // Eliminar la salida (las líneas SALIDAS_ACTIVO se eliminan en cascada si hay FK)
      await db.delete('SALIDAS', salida.ID_SALIDA, 'ID_SALIDA');

      alert(`Salida "${salida.CODIGO_SALIDA}" eliminada correctamente.`);
      loadSalidas();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleSave = async ({ cabecera, lineas }) => {
    setSaving(true);
    setSaveError(null);

    try {
      if (selectedSalida) {
        // ========== EDITAR ==========
        // Actualizar cabecera
        await db.update('SALIDAS', selectedSalida.ID_SALIDA, cabecera, 'ID_SALIDA');
        // TODO: Sincronizar líneas (eliminar las que no están, agregar nuevas)
      } else {
        // ========== CREAR NUEVA SALIDA ==========
        console.log('[SALIDA] Iniciando creación de salida...');

        // PASO 1: Crear SALIDA
        const salidaPayload = {
          CODIGO_SALIDA: cabecera.CODIGO_SALIDA,
          TIPO_SALIDA: cabecera.TIPO_SALIDA,
          NRO_PECOSA: cabecera.NRO_PECOSA || null,
          FECHA_EMISION: cabecera.FECHA_EMISION,
          FECHA_DOCUMENTO: null, // Siempre null por ahora
          ID_ALMACEN_ORIGEN: cabecera.ID_ALMACEN_ORIGEN,
          ID_EXTERNO: cabecera.ID_EXTERNO,
          ID_EMPLEADO_ENTREGA: cabecera.ID_EMPLEADO_ENTREGA || null,
          NOTAS: cabecera.NOTAS || null,
          ACTIVO: true,
        };

        const resultSalida = await db.insert('SALIDAS', salidaPayload);
        const idSalida = Array.isArray(resultSalida)
          ? resultSalida[0].ID_SALIDA
          : resultSalida.ID_SALIDA;
        console.log('[SALIDA] Creada con ID:', idSalida);

        // PASO 2: Crear SALIDAS_ACTIVO (líneas) y actualizar ACTIVOS_CONTROL
        const salidasActivosCreadas = [];

        for (const linea of lineas) {
          // 2.1 Crear línea de salida
          const salidaActivoPayload = {
            ID_SALIDA: idSalida,
            ID_ACTIVO_CONTROL: linea.ID_ACTIVO_CONTROL,
            CANTIDAD: linea.CANTIDAD,
            ESTADO_CONSERVADO: linea.ESTADO_CONSERVADO || 'Bueno',
            OBSERVACIONES: linea.OBSERVACIONES || null,
            ACTIVO: true,
          };

          const resultSalidaActivo = await db.insert('SALIDAS_ACTIVO', salidaActivoPayload);
          const idSalidaActivo = Array.isArray(resultSalidaActivo)
            ? resultSalidaActivo[0].ID_SALIDA_ACTIVO
            : resultSalidaActivo.ID_SALIDA_ACTIVO;

          salidasActivosCreadas.push(idSalidaActivo);
          console.log('[SALIDA_ACTIVO] Creada ID:', idSalidaActivo);

          // 2.2 Actualizar ACTIVOS_CONTROL según el tipo
          const activo = await db.select('ACTIVOS_CONTROL', { ID_ACTIVO_CONTROL: linea.ID_ACTIVO_CONTROL }, [
            'ID_ACTIVO_CONTROL', 'ES_ACTIVO_FIJO', 'CANTIDAD'
          ]);
          const esFijo = activo?.[0]?.ES_ACTIVO_FIJO ?? linea.ES_ACTIVO_FIJO;

          if (esFijo) {
            // Activo Fijo: Marcar como dado de baja
            await db.update('ACTIVOS_CONTROL', linea.ID_ACTIVO_CONTROL, {
              DADO_DE_BAJA: true,
              ACTIVO: false, // También marcar como inactivo
            }, 'ID_ACTIVO_CONTROL');
            console.log('[ACTIVOS_CONTROL] Activo fijo dado de baja ID:', linea.ID_ACTIVO_CONTROL);
          } else {
            // Activo Consumible: Restar cantidad
            const cantidadActual = activo?.[0]?.CANTIDAD || 0;
            const nuevaCantidad = Math.max(0, cantidadActual - linea.CANTIDAD);

            const updatePayload = { CANTIDAD: nuevaCantidad };

            // Si la cantidad llega a 0, marcar como dado de baja
            if (nuevaCantidad === 0) {
              updatePayload.DADO_DE_BAJA = true;
              updatePayload.ACTIVO = false;
            }

            await db.update('ACTIVOS_CONTROL', linea.ID_ACTIVO_CONTROL, updatePayload, 'ID_ACTIVO_CONTROL');
            console.log('[ACTIVOS_CONTROL] Consumible actualizado ID:', linea.ID_ACTIVO_CONTROL, 'Nueva cantidad:', nuevaCantidad);
          }
        }

        console.log('[SALIDA] Proceso completado. Salida ID:', idSalida, 'Líneas:', salidasActivosCreadas.length);
      }

      await loadSalidas();
      setView('list');
      setSelectedSalida(null);
    } catch (err) {
      console.error('Error al guardar salida:', err);
      setSaveError(err.message);
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
                <h1 className="text-2xl font-bold text-gray-900">Salidas</h1>
                <p className="text-sm text-gray-500 mt-0.5">Registro de egresos del patrimonio institucional</p>
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar salida
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
                <button onClick={loadSalidas} className="ml-auto text-red-600 underline text-xs">Reintentar</button>
              </div>
            )}

            <SalidasTable
              salidas={salidas}
              loading={loading}
              onView={handleView}
              onDelete={handleDelete}
            />

            {showDetalle && salidaDetalle && (
              <SalidaDetalleModal
                salida={salidaDetalle}
                onClose={() => { setShowDetalle(false); setSalidaDetalle(null); }}
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
            <SalidaForm
              salida={selectedSalida}
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

export default SalidasPage;
