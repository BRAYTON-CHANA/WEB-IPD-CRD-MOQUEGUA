import React, { useState } from 'react';
import { PasoSalidaCabecera } from './steps/PasoSalidaCabecera';
import { PasoSalidaActivos } from './steps/PasoSalidaActivos';

function SalidaForm({ salida, onSave, onCancel, saving }) {
  const isEdit = !!salida;
  const [paso, setPaso] = useState(1);

  // Paso 1 - Cabecera
  const [cabecera, setCabecera] = useState(isEdit ? {
    CODIGO_SALIDA: salida.CODIGO_SALIDA || '',
    TIPO_SALIDA: salida.TIPO_SALIDA || 'Donacion',
    NRO_PECOSA: salida.NRO_PECOSA || '',
    FECHA_EMISION: salida.FECHA_EMISION || '',
    FECHA_DOCUMENTO: null, // Siempre null por ahora
    ID_ALMACEN_ORIGEN: salida.ID_ALMACEN_ORIGEN || null,
    ID_EXTERNO: salida.ID_EXTERNO || null,
    ID_EMPLEADO_ENTREGA: salida.ID_EMPLEADO_ENTREGA || null,
    NOTAS: salida.NOTAS || '',
  } : {
    CODIGO_SALIDA: '',
    TIPO_SALIDA: 'Donacion',
    NRO_PECOSA: '',
    FECHA_EMISION: '',
    FECHA_DOCUMENTO: null, // Siempre null por ahora
    ID_ALMACEN_ORIGEN: null,
    ID_EXTERNO: null,
    ID_EMPLEADO_ENTREGA: null,
    NOTAS: '',
  });

  // Paso 2 - Líneas de activos (placeholder por ahora)
  const [lineas, setLineas] = useState(isEdit && salida.LINEAS ? salida.LINEAS : []);
  const [errors, setErrors] = useState({});

  const validarPaso1 = () => {
    const e = {};
    if (!cabecera.CODIGO_SALIDA?.trim())
      e.CODIGO_SALIDA = 'El código es obligatorio';
    if (!cabecera.TIPO_SALIDA)
      e.TIPO_SALIDA = 'El tipo de salida es obligatorio';
    if (!cabecera.FECHA_EMISION)
      e.FECHA_EMISION = 'La fecha de emisión es obligatoria';
    if (!cabecera.ID_ALMACEN_ORIGEN)
      e.ID_ALMACEN_ORIGEN = 'El almacén origen es obligatorio';
    if (!cabecera.ID_EXTERNO)
      e.ID_EXTERNO = 'El destinatario externo es obligatorio';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validarPaso2 = () => {
    const e = {};

    if (lineas.length === 0)
      e.lineas = 'Debe agregar al menos un activo a la salida';

    // Validar cada línea de activo
    lineas.forEach((linea, i) => {
      const lineaErrors = {};

      // Validar cantidad
      if (!linea.CANTIDAD || linea.CANTIDAD < 1)
        lineaErrors.CANTIDAD = 'La cantidad debe ser al menos 1';
      else if (!linea.ES_ACTIVO_FIJO && linea.CANTIDAD > linea.CANTIDAD_DISPONIBLE)
        lineaErrors.CANTIDAD = `Máximo disponible: ${linea.CANTIDAD_DISPONIBLE}`;

      // Validar estado de conservación
      if (!linea.ESTADO_CONSERVADO)
        lineaErrors.ESTADO_CONSERVADO = 'El estado es obligatorio';

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
      await onSave({ cabecera, lineas });
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="space-y-6">
      {/* Indicador de paso */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${paso >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              paso >= 1 ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Cabecera</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-200"></div>
          <div className={`flex items-center ${paso >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              paso >= 2 ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Activos</span>
          </div>
        </div>
      </div>

      {/* Contenido del paso */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        {paso === 1 && (
          <PasoSalidaCabecera
            cabecera={cabecera}
            setCabecera={setCabecera}
            errors={errors}
          />
        )}
        
        {paso === 2 && (
          <PasoSalidaActivos
            cabecera={cabecera}
            lineas={lineas}
            setLineas={setLineas}
            errors={errors}
          />
        )}
      </div>

      {/* Botones de navegación */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>

        <div className="flex gap-3">
          {paso === 2 && (
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ← Anterior
            </button>
          )}
          
          {paso === 1 ? (
            <button
              type="button"
              onClick={handleSiguiente}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : (isEdit ? 'Actualizar Salida' : 'Crear Salida')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SalidaForm;
