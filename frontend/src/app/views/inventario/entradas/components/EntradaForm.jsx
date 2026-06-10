import React, { useState, Fragment } from 'react';
import { PasoEntradaCabecera } from './steps/PasoEntradaCabecera';
import { PasoEntradaActivos } from './steps/PasoEntradaActivos';
// import { EntradaDebugView } from './debug/EntradaDebugView'; // Comentado para posible reuso

function EntradaForm({ entrada, onSave, onCancel, saving }) {
  const isEdit = !!entrada;
  const [paso, setPaso] = useState(1);
  // const [showDebugView, setShowDebugView] = useState(false); // Comentado para posible reuso

  // Paso 1 - Cabecera
  const [cabecera, setCabecera] = useState(isEdit ? {
    CODIGO_ENTRADA: entrada.CODIGO_ENTRADA || '',
    TIPO_ENTRADA: entrada.TIPO_ENTRADA || '',
    NRO_NEA: entrada.NRO_NEA || '',
    FECHA_EMISION: entrada.FECHA_EMISION || '',
    FECHA_DOCUMENTO: entrada.FECHA_DOCUMENTO || '',
    NRO_ORDEN_COMPRA: entrada.NRO_ORDEN_COMPRA || '',
    ID_ALMACEN_DESTINO: entrada.ID_ALMACEN_DESTINO || null,
    ID_PROVEEDOR: entrada.ID_PROVEEDOR || null,
    ID_EXTERNO: entrada.ID_EXTERNO || null,
    ID_EMPLEADO_RECEPTOR: entrada.ID_EMPLEADO_RECEPTOR || null,
    NOTAS: entrada.NOTAS || '',
  } : {
    CODIGO_ENTRADA: '',
    TIPO_ENTRADA: '',
    NRO_NEA: '',
    FECHA_EMISION: '',
    FECHA_DOCUMENTO: '',
    NRO_ORDEN_COMPRA: '',
    ID_ALMACEN_DESTINO: null,
    ID_PROVEEDOR: null,
    ID_EXTERNO: null,
    ID_EMPLEADO_RECEPTOR: null,
    NOTAS: '',
  });

  // Paso 2 - Líneas de activos
  const [lineas, setLineas] = useState(isEdit && entrada.LINEAS ? entrada.LINEAS : []);
  const [errors, setErrors] = useState({});

  const validarPaso1 = () => {
    const e = {};
    if (!cabecera.CODIGO_ENTRADA?.trim())
      e.CODIGO_ENTRADA = 'El código es obligatorio';
    if (!cabecera.TIPO_ENTRADA)
      e.TIPO_ENTRADA = 'El tipo de entrada es obligatorio';
    if (!cabecera.FECHA_EMISION)
      e.FECHA_EMISION = 'La fecha de emisión es obligatoria';
    if (!cabecera.ID_ALMACEN_DESTINO)
      e.ID_ALMACEN_DESTINO = 'El almacén destino es obligatorio';
    
    if (cabecera.TIPO_ENTRADA === 'Orden de Compra' && !cabecera.ID_PROVEEDOR)
      e.ID_PROVEEDOR = 'El proveedor es obligatorio para órdenes de compra';
    if (cabecera.TIPO_ENTRADA === 'Donacion' && !cabecera.ID_EXTERNO)
      e.ID_EXTERNO = 'El donante externo es obligatorio para donaciones';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validarPaso2 = () => {
    const e = {};
    
    if (lineas.length === 0)
      e.lineas = 'Debe agregar al menos un activo a la entrada';

    lineas.forEach((linea, i) => {
      const lineaErrors = {};
      // Validar que tenga datos de identidad y control (no ID_ACTIVO_CONTROL que aún no existe)
      if (!linea.identidad || (!linea.identidad.ID_ACTIVO_IDENTIDAD && !linea.identidad.ID_CLASIFICACION))
        lineaErrors.identidad = 'Seleccione o cree una identidad de activo';
      if (!linea.control || !linea.control.DESCRIPCION?.trim())
        lineaErrors.descripcion = 'La descripción del activo es obligatoria';
      if (!linea.CANTIDAD || linea.CANTIDAD < 1)
        lineaErrors.CANTIDAD = 'La cantidad debe ser al menos 1';
      if (!linea.ESTADO_CONSERVADO)
        lineaErrors.ESTADO_CONSERVADO = 'El estado de conservación es obligatorio';
      
      if (Object.keys(lineaErrors).length > 0)
        e[`linea_${i}`] = lineaErrors;
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSiguiente = () => {
    if (validarPaso1()) setPaso(2);
  };

  const handleSubmit = async () => {
    if (validarPaso2()) {
      // Pasar datos completos para guardado transaccional de 4 pasos
      await onSave({ cabecera, lineas });
    }
  };

  // Cancelar formulario - no hay limpieza de BD porque los activos se crean al guardar
  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{isEdit ? 'Editar Entrada' : 'Registrar Entrada'}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEdit ? `ID: ${entrada.ID_ENTRADA}` : 'Nuevo ingreso al patrimonio'}
          </p>
        </div>
        <button onClick={handleCancel} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Indicador de pasos */}
      <div className="flex items-center gap-0 px-6 py-3 border-b border-gray-100 bg-gray-50">
        {[{ n: 1, label: 'Datos de entrada' }, { n: 2, label: 'Activos incluidos' }].map((p, i) => (
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
          <PasoEntradaCabecera
            cabecera={cabecera}
            setCabecera={setCabecera}
            errors={errors}
          />
        )}
        {paso === 2 && (
          <PasoEntradaActivos
            cabecera={cabecera}
            lineas={lineas}
            setLineas={setLineas}
            errors={errors}
          />
        )}
      </div>

      {/* Debug View Modal - Comentado para posible reuso
      <EntradaDebugView
        cabecera={cabecera}
        lineas={lineas}
        isOpen={showDebugView}
        onClose={() => setShowDebugView(false)}
      /> */}

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <button
          type="button"
          onClick={paso === 1 ? handleCancel : () => setPaso(1)}
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
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar entrada'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EntradaForm;
