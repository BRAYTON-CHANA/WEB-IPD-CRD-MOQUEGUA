import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/shared/api';
import { Label, Input, RefSelect, RefreshBtn } from '../ui/FormFields';
import { ClasificacionModal } from '../modals/ClasificacionModal';

export function PasoIdentidad({ identidadSeleccionada, setIdentidadSeleccionada, nuevaIdentidad, setNuevaIdentidad, modoNueva, setModoNueva, errors, clasificaciones, setClasificaciones }) {
  const [identidades, setIdentidades] = useState([]);
  const [loadingIds, setLoadingIds]   = useState(true);
  const [showClasModal, setShowClasModal] = useState(false);

  const loadClasificaciones = useCallback(async () => {
    const cls = await db.select('CLASIFICACION_ITEMS', { ACTIVO: true }, ['ID_CLASIFICACION', 'DESCRIPCION', 'CODIGO', 'CATEGORIA', 'UNIDAD_MEDIDA']);
    setClasificaciones(cls || []);
  }, [setClasificaciones]);

  const reloadIdentidades = useCallback(async () => {
    const ids = await db.select('vw_sel_activos_identidad', {}, [
      'ID_ACTIVO_IDENTIDAD', 'IDENTIDAD_LABEL', 'CLASIFICACION_DESCRIPCION',
      'CLASIFICACION_CATEGORIA', 'MARCA', 'MODELO', 'COLOR', 'DIMENSIONES',
      'MATERIAL', 'COMENTARIOS'
    ]);
    setIdentidades(ids || []);
  }, []);

  useEffect(() => {
    Promise.all([
      db.select('vw_sel_activos_identidad', {}, [
        'ID_ACTIVO_IDENTIDAD', 'IDENTIDAD_LABEL', 'CLASIFICACION_DESCRIPCION',
        'CLASIFICACION_CATEGORIA', 'MARCA', 'MODELO', 'COLOR', 'DIMENSIONES',
        'MATERIAL', 'COMENTARIOS'
      ]),
      db.select('CLASIFICACION_ITEMS', { ACTIVO: true }, ['ID_CLASIFICACION', 'DESCRIPCION', 'CODIGO', 'CATEGORIA', 'UNIDAD_MEDIDA'])
    ]).then(([ids, cls]) => {
      setIdentidades(ids || []);
      setClasificaciones(cls || []);
    }).finally(() => setLoadingIds(false));
  }, [setClasificaciones]);

  const handleClasCreated = async (nueva) => {
    await loadClasificaciones();
    setNuevaIdentidad(prev => ({ ...prev, ID_CLASIFICACION: nueva.ID_CLASIFICACION }));
    setShowClasModal(false);
  };

  const handleSelectIdentidadById = (idVal) => {
    if (!idVal) { setIdentidadSeleccionada(null); return; }
    const found = identidades.find(i => i.ID_ACTIVO_IDENTIDAD === Number(idVal));
    if (found) { setIdentidadSeleccionada(found); setModoNueva(false); }
  };

  const handleNuevaChange = (field, val) => {
    setNuevaIdentidad(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Identidad del ítem</h3>
          <p className="text-xs text-gray-500 mt-0.5">Busca o crea la ficha técnica del activo</p>
        </div>
      </div>

      {!modoNueva ? (
        <>
          {/* Select de identidad existente */}
          <div>
            <Label required>Seleccionar identidad existente</Label>
            <div className="flex gap-1.5 items-center">
              <select
                value={identidadSeleccionada?.ID_ACTIVO_IDENTIDAD ?? ''}
                onChange={e => handleSelectIdentidadById(e.target.value)}
                disabled={loadingIds}
                className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white ${errors.identidad ? 'border-red-300' : 'border-gray-200'} ${loadingIds ? 'text-gray-400' : ''}`}
              >
                <option value="">{loadingIds ? 'Cargando...' : '— Seleccione una identidad —'}</option>
                {identidades.map(id => (
                  <option key={id.ID_ACTIVO_IDENTIDAD} value={id.ID_ACTIVO_IDENTIDAD}>
                    {id.IDENTIDAD_LABEL}{id.CLASIFICACION_CATEGORIA ? ` · ${id.CLASIFICACION_CATEGORIA}` : ''}
                  </option>
                ))}
              </select>
              <RefreshBtn onRefresh={reloadIdentidades} />
            </div>
            {errors.identidad && <p className="text-xs text-red-500 mt-1">{errors.identidad}</p>}
          </div>

          {/* Tarjeta de identidad seleccionada */}
          {identidadSeleccionada && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Identidad seleccionada</p>
                <button onClick={() => setIdentidadSeleccionada(null)} className="text-blue-400 hover:text-blue-600 text-xs">Cambiar</button>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700">
                {[
                  ['Clasificación', identidadSeleccionada.CLASIFICACION_DESCRIPCION, 'S/CL'],
                  ['Categoría',     identidadSeleccionada.CLASIFICACION_CATEGORIA, 'S/CA'],
                  ['Marca',         identidadSeleccionada.MARCA,       'S/M'],
                  ['Modelo',        identidadSeleccionada.MODELO,      'S/MD'],
                  ['Color',         identidadSeleccionada.COLOR,       'S/C'],
                  ['Material',      identidadSeleccionada.MATERIAL,    'S/MT'],
                  ['Dimensiones',   identidadSeleccionada.DIMENSIONES, 'S/D'],
                ].map(([k, v, fallback]) => (
                  <div key={k}>
                    <span className="text-gray-400">{k}: </span>
                    {v ? <span className="font-medium">{v}</span> : <span className="text-gray-300 italic">{fallback}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">¿No existe?</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <button
            type="button"
            onClick={() => { setModoNueva(true); setIdentidadSeleccionada(null); }}
            className="w-full py-2 border border-dashed border-blue-300 text-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors"
          >
            + Crear nueva identidad
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => { setModoNueva(false); setNuevaIdentidad({}); }}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1"
            >
              ← Buscar existente
            </button>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs text-gray-500">Creando nueva ficha técnica</span>
          </div>

          {showClasModal && (
            <ClasificacionModal
              onClose={() => setShowClasModal(false)}
              onCreated={handleClasCreated}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label required>Clasificación del ítem</Label>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <RefSelect
                    error={errors.ID_CLASIFICACION}
                    options={clasificaciones}
                    valueKey="ID_CLASIFICACION"
                    labelKey="DESCRIPCION"
                    labelFn={opt => [
                      opt.CODIGO ? `[${opt.CODIGO}]` : null,
                      opt.DESCRIPCION,
                      opt.CATEGORIA ? `· ${opt.CATEGORIA}` : null,
                    ].filter(Boolean).join(' ')}
                    value={nuevaIdentidad.ID_CLASIFICACION}
                    onChange={v => handleNuevaChange('ID_CLASIFICACION', v)}
                    placeholder="Seleccione una clasificación"
                    onRefresh={loadClasificaciones}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowClasModal(true)}
                  title="Nueva clasificación"
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            <Input label="Marca" value={nuevaIdentidad.MARCA || ''} onChange={e => handleNuevaChange('MARCA', e.target.value)} placeholder="Ej: Sony, Metálica..." />
            <Input label="Modelo" value={nuevaIdentidad.MODELO || ''} onChange={e => handleNuevaChange('MODELO', e.target.value)} placeholder="Ej: X200, Estándar..." />
            <Input label="Color" value={nuevaIdentidad.COLOR || ''} onChange={e => handleNuevaChange('COLOR', e.target.value)} placeholder="Ej: Negro, Azul..." />
            <Input label="Material" value={nuevaIdentidad.MATERIAL || ''} onChange={e => handleNuevaChange('MATERIAL', e.target.value)} placeholder="Ej: Aluminio, Plástico..." />
            <Input label="Dimensiones" value={nuevaIdentidad.DIMENSIONES || ''} onChange={e => handleNuevaChange('DIMENSIONES', e.target.value)} placeholder="Ej: 80x60x75 cm" />
            <div className="md:col-span-2">
              <Label>Comentarios técnicos</Label>
              <textarea
                value={nuevaIdentidad.COMENTARIOS || ''}
                onChange={e => handleNuevaChange('COMENTARIOS', e.target.value)}
                rows={2}
                placeholder="Notas técnicas adicionales..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
