import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/shared/api';
import { Label, Input, Select, Toggle, RefSelect, ESTADOS_CONSERVACION } from '../ui/FormFields';
import { GrupoModal } from '../modals/GrupoModal';
import { AlmacenModal } from '../modals/AlmacenModal';
import { EmpleadoModal } from '../modals/EmpleadoModal';
import { ProveedorModal } from '../modals/ProveedorModal';

function IdentidadPreview({ identidadSeleccionada, nuevaIdentidad, modoNueva, clasificaciones }) {
  let datos = {};
  if (!modoNueva && identidadSeleccionada) {
    datos = {
      clasificacion: identidadSeleccionada.CLASIFICACION_DESCRIPCION,
      categoria:     identidadSeleccionada.CLASIFICACION_CATEGORIA,
      marca:         identidadSeleccionada.MARCA,
      modelo:        identidadSeleccionada.MODELO,
      color:         identidadSeleccionada.COLOR,
      material:      identidadSeleccionada.MATERIAL,
      dimensiones:   identidadSeleccionada.DIMENSIONES,
    };
  } else if (modoNueva) {
    const cls = clasificaciones?.find(c => c.ID_CLASIFICACION === nuevaIdentidad.ID_CLASIFICACION);
    datos = {
      clasificacion: cls?.DESCRIPCION,
      categoria:     cls?.CATEGORIA,
      marca:         nuevaIdentidad.MARCA,
      modelo:        nuevaIdentidad.MODELO,
      color:         nuevaIdentidad.COLOR,
      material:      nuevaIdentidad.MATERIAL,
      dimensiones:   nuevaIdentidad.DIMENSIONES,
    };
  }

  const fields = [
    ['Clasificación', datos.clasificacion, 'S/CL'],
    ['Categoría',     datos.categoria,     'S/CA'],
    ['Marca',         datos.marca,         'S/M'],
    ['Modelo',        datos.modelo,        'S/MD'],
    ['Color',         datos.color,         'S/C'],
    ['Material',      datos.material,      'S/MT'],
    ['Dimensiones',   datos.dimensiones,   'S/D'],
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Ficha técnica del ítem</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-xs text-gray-700">
        {fields.map(([k, v, fallback]) => (
          <div key={k}>
            <span className="text-gray-400">{k}: </span>
            {v
              ? <span className="font-medium">{v}</span>
              : <span className="text-gray-300 italic">{fallback}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PasoControl({ control, setControl, errors, isEdit, identidadSeleccionada, nuevaIdentidad, modoNueva, clasificaciones, almacenBloqueado }) {
  const [almacenes, setAlmacenes]     = useState([]);
  const [empleados, setEmpleados]     = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [grupos, setGrupos]           = useState([]);
  const [showGrupoModal, setShowGrupoModal] = useState(false);
  const [showAlmacenModal, setShowAlmacenModal] = useState(false);
  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false);
  const [showProveedorModal, setShowProveedorModal] = useState(false);

  const reloadAlmacenes   = useCallback(async () => {
    const r = await db.select('vw_almacenes_por_infraestructura', { ALMACEN_ACTIVO: true }, [
      'ID_ALMACEN', 'NOMBRE_ALMACEN', 'INFRAESTRUCTURA', 'TIPO_INFRAESTRUCTURA', 'REGION', 'PROVINCIA', 'DISTRITO', 'DIRECCION_EXACTA', 'REFERENCIA'
    ]);
    setAlmacenes(r || []);
  }, []);
  const reloadEmpleados   = useCallback(async () => { const r = await db.select('EMPLEADOS',      { ACTIVO: true }, ['ID_EMPLEADO', 'NOMBRES', 'APELLIDOS']);                               setEmpleados((r || []).map(e => ({ ...e, NOMBRE_COMPLETO: `${e.NOMBRES} ${e.APELLIDOS}` }))); }, []);
  const reloadProveedores = useCallback(async () => { const r = await db.select('PROVEEDORES',    { ACTIVO: true }, ['ID_PROVEEDOR', 'NOMBRE_PROVEEDOR']);                                    setProveedores(r || []); }, []);
  const reloadGrupos      = useCallback(async (idAlmacen = null) => {
    const where = idAlmacen ? { ACTIVO: true, ID_ALMACEN: idAlmacen } : { ACTIVO: true };
    const r = await db.select('GRUPOS_ACTIVOS', where, ['ID_GRUPO', 'NOMBRE', 'COD_IDENTIFICADOR_GENERAL']);
    setGrupos(r || []);
  }, []);

  useEffect(() => {
    Promise.all([
      reloadAlmacenes(),
      reloadEmpleados(),
      reloadProveedores(),
    ]).then(() => {
      // Los sets ya se hacen dentro de cada reload function
    });
  }, []);

  useEffect(() => {
    if (control.ID_ALMACEN_ASIGNADO) {
      reloadGrupos(control.ID_ALMACEN_ASIGNADO);
    } else {
      setGrupos([]);
    }
  }, [control.ID_ALMACEN_ASIGNADO, reloadGrupos]);

  const set = (field, val) => setControl(prev => ({ ...prev, [field]: val }));

  const esFijo = control.ES_ACTIVO_FIJO ?? true;

  const handleActivoFijoToggle = (v) => {
    set('ES_ACTIVO_FIJO', v);
    if (v) set('CANTIDAD', 1);
  };

  const handleGrupoCreated = async (nuevo) => {
    await reloadGrupos(control.ID_ALMACEN_ASIGNADO);
    set('ID_GRUPO', nuevo.ID_GRUPO);
    setShowGrupoModal(false);
  };

  const handleAlmacenCreated = async (nuevo) => {
    await reloadAlmacenes();
    set('ID_ALMACEN_ASIGNADO', nuevo.ID_ALMACEN);
    setShowAlmacenModal(false);
  };

  const handleAlmacenChange = (value) => {
    set('ID_ALMACEN_ASIGNADO', value);
    // Deselección en cascada: si se limpia almacén, también limpiar grupo
    if (!value) {
      set('ID_GRUPO', null);
      setGrupos([]);
    }
  };

  const handleEmpleadoCreated = async (nuevo) => {
    await reloadEmpleados();
    set('ID_EMPLEADO_DESIGNADO', nuevo.ID_EMPLEADO);
    setShowEmpleadoModal(false);
  };

  const handleProveedorCreated = async (nuevo) => {
    await reloadProveedores();
    set('ID_PROVEEDOR', nuevo.ID_PROVEEDOR);
    setShowProveedorModal(false);
  };

  const almacenSeleccionado = almacenes.find(a => a.ID_ALMACEN === control.ID_ALMACEN_ASIGNADO);
const nombreAlmacenSeleccionado = almacenSeleccionado?.NOMBRE_ALMACEN;

  return (
    <div className="space-y-6">

      {/* Preview identidad */}
      {!isEdit && (
        <IdentidadPreview
          identidadSeleccionada={identidadSeleccionada}
          nuevaIdentidad={nuevaIdentidad}
          modoNueva={modoNueva}
          clasificaciones={clasificaciones}
        />
      )}

      {/* 1. Asignación y ubicación */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-gray-800">Asignación y ubicación</h4>
        </div>
        <div className="space-y-5">
          {/* Almacén - primera fila completo */}
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <RefSelect
                label="Almacén asignado"
                required
                options={almacenes}
                valueKey="ID_ALMACEN"
                labelKey="NOMBRE_ALMACEN"
                labelFn={opt => `${opt.NOMBRE_ALMACEN} - ${opt.INFRAESTRUCTURA || 'Sin infraestructura'}`}
                value={control.ID_ALMACEN_ASIGNADO}
                onChange={handleAlmacenChange}
                placeholder="Sin almacén"
                onRefresh={reloadAlmacenes}
                error={errors.ID_ALMACEN_ASIGNADO}
                disabled={almacenBloqueado}
              />
              {almacenBloqueado && (
                <p className="text-xs text-blue-600 mt-1">
                  Almacén predefinido desde la entrada
                </p>
              )}
            </div>
            {!almacenBloqueado && (
              <button
                type="button"
                onClick={() => setShowAlmacenModal(true)}
                title="Nuevo almacén"
                className="flex-shrink-0 mt-6 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>

          {/* Infraestructura - solo si hay almacén seleccionado */}
          {almacenSeleccionado && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs">
              <div className="flex items-start gap-1">
                <span className="text-gray-500 mt-0.5">📍</span>
                <div className="flex-1">
                  <div className="text-gray-700 font-medium mb-1">
                    {almacenSeleccionado.INFRAESTRUCTURA}
                  </div>
                  <div className="text-gray-600 space-y-0.5">
                    {almacenSeleccionado.TIPO_INFRAESTRUCTURA && (
                      <div>Tipo: {almacenSeleccionado.TIPO_INFRAESTRUCTURA}</div>
                    )}
                    {(almacenSeleccionado.REGION || almacenSeleccionado.PROVINCIA || almacenSeleccionado.DISTRITO) && (
                      <div>
                        {almacenSeleccionado.REGION && `${almacenSeleccionado.REGION}`}
                        {almacenSeleccionado.PROVINCIA && ` - ${almacenSeleccionado.PROVINCIA}`}
                        {almacenSeleccionado.DISTRITO && ` - ${almacenSeleccionado.DISTRITO}`}
                      </div>
                    )}
                    {almacenSeleccionado.DIRECCION_EXACTA && (
                      <div>Dirección: {almacenSeleccionado.DIRECCION_EXACTA}</div>
                    )}
                    {almacenSeleccionado.REFERENCIA && (
                      <div>Referencia: {almacenSeleccionado.REFERENCIA}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grupo de activos - solo si hay almacén seleccionado */}
          {control.ID_ALMACEN_ASIGNADO && (
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <RefSelect
                  label="Grupo de activos"
                  required
                  options={grupos}
                  valueKey="ID_GRUPO"
                  labelKey="NOMBRE"
                  value={control.ID_GRUPO}
                  onChange={v => set('ID_GRUPO', v)}
                  placeholder="Sin grupo"
                  onRefresh={() => reloadGrupos(control.ID_ALMACEN_ASIGNADO)}
                  error={errors.ID_GRUPO}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowGrupoModal(true)}
                title="Nuevo grupo"
                className="flex-shrink-0 mt-6 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Resto de campos en grid de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <RefSelect 
                label="Empleado designado" 
                options={empleados} 
                valueKey="ID_EMPLEADO" 
                labelKey="NOMBRE_COMPLETO" 
                value={control.ID_EMPLEADO_DESIGNADO} 
                onChange={v => set('ID_EMPLEADO_DESIGNADO', v)} 
                placeholder="Sin responsable" 
                onRefresh={reloadEmpleados} 
              />
            </div>
            <button
              type="button"
              onClick={() => setShowEmpleadoModal(true)}
              title="Nuevo empleado"
              className="flex-shrink-0 mt-6 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <RefSelect 
                label="Proveedor" 
                options={proveedores} 
                valueKey="ID_PROVEEDOR" 
                labelKey="NOMBRE_PROVEEDOR" 
                value={control.ID_PROVEEDOR} 
                onChange={v => set('ID_PROVEEDOR', v)} 
                placeholder="Sin proveedor" 
                onRefresh={reloadProveedores} 
              />
            </div>
            <button
              type="button"
              onClick={() => setShowProveedorModal(true)}
              title="Nuevo proveedor"
              className="flex-shrink-0 mt-6 w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="md:col-span-2">
            <Input 
              label="Fecha de asignación" 
              type="date" 
              value={control.FECHA_ASIGNACION || ''} 
              disabled 
              className="bg-gray-50 text-gray-600 border-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">Se actualiza automáticamente al cambiar el empleado asignado</p>
          </div>
        </div>
      </div>

      {/* 2. Identificación patrimonial */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-gray-800">Identificación patrimonial</h4>
        </div>
        <div className="mb-4">
          <Toggle label="Activo fijo patrimonial" checked={esFijo} onChange={handleActivoFijoToggle} />
          {esFijo && (
            <p className="text-xs text-blue-600 mt-1 ml-0.5">La cantidad queda fijada en 1 y se requiere código patrimonial único.</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Código Patrimonial"
            value={control.COD_PATRIMONIAL || ''}
            onChange={e => set('COD_PATRIMONIAL', e.target.value)}
            placeholder={esFijo ? 'Ej: IPD-2025-001' : 'Solo para activos fijos'}
            disabled={!esFijo}
            error={errors.COD_PATRIMONIAL}
          />
          <Input 
            label="Número Serial" 
            value={control.NUMERO_SERIAL || ''} 
            onChange={e => set('NUMERO_SERIAL', e.target.value)} 
            placeholder={esFijo ? "Ej: SN-123456" : "Solo para activos fijos"}
            disabled={!esFijo}
          />
        </div>
      </div>

      {/* 3. Estado físico */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-gray-800">Estado físico</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Estado de conservación" value={control.ESTADO || ''} onChange={e => set('ESTADO', e.target.value)}>
            <option value="">Sin especificar</option>
            {ESTADOS_CONSERVACION.map(e => <option key={e} value={e}>{e}</option>)}
          </Select>
          {esFijo ? (
            <Input label="Cantidad" type="number" value={1} disabled />
          ) : (
            <Input label="Cantidad *" type="number" min="1" value={control.CANTIDAD ?? 1} onChange={e => set('CANTIDAD', parseInt(e.target.value) || 1)} error={errors.CANTIDAD} />
          )}
          <Input label="Peso (kg)" type="number" step="0.001" min="0" value={control.PESO_KG || ''} onChange={e => set('PESO_KG', e.target.value || null)} placeholder="Ej: 3.500" />
        </div>
      </div>

      {/* 4. Descripción individual */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-gray-800">Descripción individual <span className="text-red-500 ml-1">*</span></h4>
        </div>
        <div className="mb-4">
          <textarea
            value={control.DESCRIPCION || ''}
            onChange={e => set('DESCRIPCION', e.target.value)}
            rows={4}
            placeholder="Descripción detallada del activo: características específicas, estado particular, uso previsto, detalles únicos, etc."
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none ${
              errors.DESCRIPCION ? 'border-red-300 focus:ring-red-300' : 'border-gray-200'
            }`}
          />
          {errors.DESCRIPCION && (
            <p className="mt-1 text-xs text-red-600">{errors.DESCRIPCION}</p>
          )}
        </div>
      </div>

      {/* 5. Observaciones */}
      <div>
        <Label>Observaciones</Label>
        <textarea
          value={control.OBSERVACIONES || ''}
          onChange={e => set('OBSERVACIONES', e.target.value)}
          rows={3}
          placeholder="Notas adicionales sobre el activo..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Modales */}
      {showGrupoModal && (
        <GrupoModal
          onClose={() => setShowGrupoModal(false)}
          onCreated={handleGrupoCreated}
          idAlmacen={control.ID_ALMACEN_ASIGNADO}
          nombreAlmacen={nombreAlmacenSeleccionado}
        />
      )}
      {showAlmacenModal && (
        <AlmacenModal
          onClose={() => setShowAlmacenModal(false)}
          onCreated={handleAlmacenCreated}
        />
      )}
      {showEmpleadoModal && (
        <EmpleadoModal
          onClose={() => setShowEmpleadoModal(false)}
          onCreated={handleEmpleadoCreated}
        />
      )}
      {showProveedorModal && (
        <ProveedorModal
          onClose={() => setShowProveedorModal(false)}
          onCreated={handleProveedorCreated}
        />
      )}
    </div>
  );
}
