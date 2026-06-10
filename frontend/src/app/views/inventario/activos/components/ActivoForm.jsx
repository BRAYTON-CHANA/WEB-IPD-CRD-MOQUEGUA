import React, { useState, Fragment } from 'react';
import { PasoIdentidad } from './steps/PasoIdentidad';
import { PasoControl } from './steps/PasoControl';

// ─── Componente principal ────────────────────────────────────────────────────

function ActivoForm({ activo, onSave, onCancel, saving, almacenPreseleccionado, almacenBloqueado }) {
  const isEdit = !!activo;
  const isAlmacenBloqueado = almacenBloqueado && almacenPreseleccionado;
  const [paso, setPaso] = useState(1);

  // Paso 1 — identidad
  const [identidadSeleccionada, setIdentidadSeleccionada] = useState(
    isEdit ? { ID_ACTIVO_IDENTIDAD: activo.ID_ACTIVO_IDENTIDAD, IDENTIDAD_LABEL: activo.ITEM_NOMBRE_COMPLETO } : null
  );
  const [nuevaIdentidad, setNuevaIdentidad] = useState({});
  const [modoNueva, setModoNueva] = useState(false);
  const [clasificaciones, setClasificaciones] = useState([]);

  // Paso 2 — control
  const [control, setControl] = useState(isEdit ? {
    COD_PATRIMONIAL:         activo.COD_PATRIMONIAL         || '',
    NUMERO_SERIAL:           activo.NUMERO_SERIAL           || '',
    ES_ACTIVO_FIJO:          activo.ES_ACTIVO_FIJO          ?? true,
    ESTADO:                  activo.ESTADO                  || '',
    CANTIDAD:                activo.CANTIDAD                ?? 1,
    PESO_KG:                 activo.PESO_KG                 || '',
    ID_GRUPO:                activo.ID_GRUPO                || null,
    ID_ALMACEN_ASIGNADO:     activo.ID_ALMACEN_ASIGNADO     || null,
    ID_EMPLEADO_DESIGNADO:   activo.ID_EMPLEADO_DESIGNADO   || null,
    RESPONSABLE_PROVISIONAL: activo.RESPONSABLE_PROVISIONAL || '',
    ID_PROVEEDOR:            activo.ID_PROVEEDOR            || null,
    PROVEEDOR_PROVISIONAL:   activo.PROVEEDOR_PROVISIONAL   || '',
    CONFIRMADO:              activo.CONFIRMADO              ?? false,
    EN_PRESTAMO:             activo.EN_PRESTAMO             ?? false,
    ACTIVO:                  activo.ACTIVO                  ?? true,
    OBSERVACIONES:           activo.OBSERVACIONES           || '',
    DESCRIPCION:             activo.DESCRIPCION             || '',
  } : {
    ES_ACTIVO_FIJO: true,
    CONFIRMADO:     !almacenBloqueado, // Si viene de entrada, no está confirmado aún
    EN_PRESTAMO:    false,
    ACTIVO:         true,
    CANTIDAD:       1,
    ESTADO:         'Regular',
    DESCRIPCION:    '',
    ID_ALMACEN_ASIGNADO: almacenPreseleccionado || null, // Preseleccionar si viene de entrada
  });

  
  const [errors, setErrors] = useState({});

  const validarPaso1 = () => {
    const e = {};
    if (!isEdit) {
      if (!identidadSeleccionada && !modoNueva)
        e.identidad = 'Debe seleccionar o crear una identidad';
      if (modoNueva && !nuevaIdentidad.ID_CLASIFICACION)
        e.ID_CLASIFICACION = 'La clasificación es obligatoria';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validarPaso2 = () => {
    const e = {};
    
    // Campos obligatorios
    if (!control.ID_ALMACEN_ASIGNADO)
      e.ID_ALMACEN_ASIGNADO = 'El almacén es obligatorio';
    if (!control.ID_GRUPO)
      e.ID_GRUPO = 'El grupo es obligatorio';
    if (!control.DESCRIPCION || control.DESCRIPCION.trim() === '')
      e.DESCRIPCION = 'La descripción del activo es obligatoria';
    if (!control.CANTIDAD || control.CANTIDAD <= 0)
      e.CANTIDAD = 'La cantidad debe ser mayor a 0';
    
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSiguiente = () => { if (validarPaso1()) setPaso(2); };
  const handleSubmit    = async () => { 
    if (validarPaso2()) {
      await onSave({ identidadSeleccionada, nuevaIdentidad, modoNueva, control, clasificaciones }); 
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Editar Activo' : 'Registrar Activo'}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{isEdit ? `ID: ${activo.ID_ACTIVO_CONTROL}` : 'Nuevo activo patrimonial'}</p>
        </div>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Indicador de pasos */}
      <div className="flex items-center gap-0 px-6 py-3 border-b border-gray-100 bg-gray-50">
        {[{ n: 1, label: 'Identidad del ítem' }, { n: 2, label: 'Control y asignación' }].map((p, i) => (
            <Fragment key={p.n}>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${paso >= p.n ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {paso > p.n
                    ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    : p.n}
                </div>
                <span className={`text-xs font-medium ${paso >= p.n ? 'text-blue-700' : 'text-gray-400'}`}>{p.label}</span>
              </div>
              {i < 1 && <div className={`flex-1 h-px mx-3 ${paso > 1 ? 'bg-blue-300' : 'bg-gray-200'}`} />}
            </Fragment>
          ))}
      </div>

      <div className="px-6 py-5">
        {paso === 1 && (
          <PasoIdentidad
            identidadSeleccionada={identidadSeleccionada}
            setIdentidadSeleccionada={setIdentidadSeleccionada}
            nuevaIdentidad={nuevaIdentidad}
            setNuevaIdentidad={setNuevaIdentidad}
            modoNueva={modoNueva}
            setModoNueva={setModoNueva}
            errors={errors}
            clasificaciones={clasificaciones}
            setClasificaciones={setClasificaciones}
          />
        )}
        {paso === 2 && (
          <PasoControl
            control={control}
            setControl={setControl}
            errors={errors}
            isEdit={isEdit}
            identidadSeleccionada={identidadSeleccionada}
            nuevaIdentidad={nuevaIdentidad}
            modoNueva={modoNueva}
            clasificaciones={clasificaciones}
            almacenBloqueado={isAlmacenBloqueado}
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <button
          type="button"
          onClick={paso === 1 ? onCancel : () => setPaso(1)}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {paso === 1 ? 'Cancelar' : '← Atrás'}
        </button>
        <div className="flex gap-2">
          {paso === 1 && (
            <button
              type="button"
              onClick={handleSiguiente}
              className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Siguiente →
            </button>
          )}
          {paso === 2 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-60"
            >
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar activo'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ActivoForm;
