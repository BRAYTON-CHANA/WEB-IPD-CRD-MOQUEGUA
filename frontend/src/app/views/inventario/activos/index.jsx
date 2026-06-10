import React, { useState, useEffect, useCallback } from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import InventarioSidebar from '../InventarioSidebar';
import { db } from '@/shared/api';
import ActivosTable from './components/ActivosTable';
import ActivoForm from './components/ActivoForm';

const COLUMNS = [
  'ID_ACTIVO_CONTROL', 'ID_ACTIVO_IDENTIDAD', 'ID_GRUPO', 'ID_ALMACEN_ASIGNADO',
  'ID_EMPLEADO_DESIGNADO', 'ID_PROVEEDOR', 'ID_ENTRADA_ACTIVO_ORIGEN', 'ID_ULTIMO_MOVIMIENTO',
  'COD_PATRIMONIAL', 'NUMERO_SERIAL', 'ES_ACTIVO_FIJO', 'ESTADO', 'CANTIDAD', 'PESO_KG',
  'CONFIRMADO', 'DADO_DE_BAJA', 'EN_PRESTAMO', 'ACTIVO',
  'RESPONSABLE_PROVISIONAL', 'PROVEEDOR_PROVISIONAL',
  'FECHA_ASIGNACION', 'FECHA_ULTIMA_ENTRADA', 'FECHA_ULTIMA_SALIDA', 'ULTIMA_MODIFICACION',
  'OBSERVACIONES', 'DESCRIPCION', 'ESTADO', 'ESTADO_DISPLAY', 'ITEM_NOMBRE_COMPLETO',
  'CODIGOS_COMBINADOS', 'CODIGO_ITEM', 'MARCA', 'MODELO', 'COLOR', 'DIMENSIONES', 'MATERIAL',
  'CLASIFICACION_DESCRIPCION', 'CLASIFICACION_CATEGORIA', 'CLASIFICACION_UNIDAD_MEDIDA',
  'GRUPO_NOMBRE', 'ALMACEN_NOMBRE', 'EMPLEADO_NOMBRE', 'PROVEEDOR_NOMBRE',
  'INFRAESTRUCTURA_NOMBRE',
];

function ActivosPage() {
  const [activos, setActivos]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [view, setView]                 = useState('list'); // 'list' | 'form'
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [saving, setSaving]             = useState(false);
  const [saveError, setSaveError]       = useState(null);
  const [refreshing, setRefreshing]     = useState(false);

  const loadActivos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const PAGE_SIZE = 1000;
      let allActivos = [];
      let offset = 0;
      let hasMore = true;

      while (hasMore) {
        const result = await db.selectWithLimit('vw_activos_completo', PAGE_SIZE, offset, {}, COLUMNS);
        const batch = result || [];
        allActivos = [...allActivos, ...batch];

        if (batch.length < PAGE_SIZE) {
          hasMore = false;
        } else {
          offset += PAGE_SIZE;
        }
      }

      setActivos(allActivos);
    } catch (err) {
      setError('Error al cargar activos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadActivos(); }, [loadActivos]);

  const handleCreate = () => { setSelectedActivo(null); setSaveError(null); setView('form'); };
  const handleEdit   = (a)  => { setSelectedActivo(a);   setSaveError(null); setView('form'); };
  const handleBack   = ()   => { setSelectedActivo(null); setView('list'); };
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadActivos();
    setRefreshing(false);
  };

  const handleToggleActivo = async (activo) => {
    const accion = activo.ACTIVO ? 'desactivar' : 'activar';
    if (!confirm(`¿${accion.charAt(0).toUpperCase() + accion.slice(1)} el activo "${activo.ITEM_NOMBRE_COMPLETO || activo.COD_PATRIMONIAL || 'sin nombre'}"?`)) return;
    try {
      await db.update('ACTIVOS_CONTROL', activo.ID_ACTIVO_CONTROL, { ACTIVO: !activo.ACTIVO }, 'ID_ACTIVO_CONTROL');
      loadActivos();
    } catch (err) {
      alert('Error al actualizar: ' + err.message);
    }
  };

  const handleDelete = async (activo) => {
    if (!confirm(`¿Está seguro de eliminar el activo "${activo.ITEM_NOMBRE_COMPLETO || activo.COD_PATRIMONIAL || 'sin nombre'}"?\n\nEsta acción eliminará únicamente el registro de control del activo.`)) return;
    try {
      await db.delete('ACTIVOS_CONTROL', activo.ID_ACTIVO_CONTROL, 'ID_ACTIVO_CONTROL');
      loadActivos();
    } catch (err) {
      alert('Error al eliminar el activo: ' + err.message);
    }
  };

  const handleSave = async ({ identidadSeleccionada, nuevaIdentidad, modoNueva, control }) => {
    setSaving(true);
    setSaveError(null);
    try {
      if (selectedActivo) {
        // EDITAR — solo ACTIVOS_CONTROL
        const payload = { ...control };
        if (payload.PESO_KG === '') payload.PESO_KG = null;
        await db.update('ACTIVOS_CONTROL', selectedActivo.ID_ACTIVO_CONTROL, payload, 'ID_ACTIVO_CONTROL');
      } else {
        // CREAR — primero identidad si es nueva
        let idActivoIdentidad;
        if (modoNueva) {
          const identidadCreada = await db.insert('ACTIVOS_IDENTIDAD', {
            ID_CLASIFICACION: nuevaIdentidad.ID_CLASIFICACION || null,
            MARCA:            nuevaIdentidad.MARCA            || null,
            MODELO:           nuevaIdentidad.MODELO           || null,
            COLOR:            nuevaIdentidad.COLOR            || null,
            DIMENSIONES:      nuevaIdentidad.DIMENSIONES      || null,
            MATERIAL:         nuevaIdentidad.MATERIAL         || null,
            ACTIVO:           true,
          });
          idActivoIdentidad = Array.isArray(identidadCreada) ? identidadCreada[0].ID_ACTIVO_IDENTIDAD : identidadCreada.ID_ACTIVO_IDENTIDAD;
        } else {
          idActivoIdentidad = identidadSeleccionada.ID_ACTIVO_IDENTIDAD;
        }

        const payload = {
          ID_ACTIVO_IDENTIDAD:      idActivoIdentidad,
          COD_PATRIMONIAL:          control.COD_PATRIMONIAL          || null,
          NUMERO_SERIAL:            control.NUMERO_SERIAL            || null,
          ES_ACTIVO_FIJO:           control.ES_ACTIVO_FIJO           ?? true,
          ESTADO:                   control.ESTADO                   || null,
          CANTIDAD:                 control.CANTIDAD                 ?? 1,
          PESO_KG:                  control.PESO_KG                  || null,
          ID_GRUPO:                 control.ID_GRUPO                 || null,
          ID_ALMACEN_ASIGNADO:      control.ID_ALMACEN_ASIGNADO      || null,
          ID_EMPLEADO_DESIGNADO:    control.ID_EMPLEADO_DESIGNADO    || null,
          RESPONSABLE_PROVISIONAL:  control.RESPONSABLE_PROVISIONAL  || null,
          ID_PROVEEDOR:             control.ID_PROVEEDOR             || null,
          PROVEEDOR_PROVISIONAL:    control.PROVEEDOR_PROVISIONAL    || null,
          CONFIRMADO:               control.CONFIRMADO               ?? false,
          EN_PRESTAMO:              false,
          ACTIVO:                   control.ACTIVO                   ?? true,
          DESCRIPCION:              control.DESCRIPCION              || null,
          OBSERVACIONES:            control.OBSERVACIONES            || null,
        };
        await db.insert('ACTIVOS_CONTROL', payload);
      }
      await loadActivos();
      setView('list');
      setSelectedActivo(null);
    } catch (err) {
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
                <h1 className="text-2xl font-bold text-gray-900">Activos</h1>
                <p className="text-sm text-gray-500 mt-0.5">Gestión de activos patrimoniales</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  title="Recargar activos"
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {refreshing ? 'Cargando...' : 'Refrescar'}
                </button>
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Registrar activo
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
                <button onClick={loadActivos} className="ml-auto text-red-600 underline text-xs">Reintentar</button>
              </div>
            )}

            <ActivosTable
              activos={activos}
              loading={loading}
              onEdit={handleEdit}
              onToggleActivo={handleToggleActivo}
              onDelete={handleDelete}
            />
          </>
        ) : (
          <>
            {saveError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {saveError}
              </div>
            )}
            <ActivoForm
              activo={selectedActivo}
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

export default ActivosPage;
