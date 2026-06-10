import React, { useState, useEffect } from 'react';
import { db } from '@/shared/api';
import { ActivoFormModal } from '../modals/ActivoFormModal';

const ESTADOS_CONSERVACION = ['Excelente', 'Bueno', 'Regular', 'Malo', 'Obsoleto'];

// Fila de tabla mostrando activo creado (solo lectura con campos editables)
function FilaActivoCreado({
  index,
  linea,
  onChange,
  onRemove,
  errors
}) {
  const set = (field, val) => onChange(index, { ...linea, [field]: val });

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-3 py-3 text-center text-xs text-gray-500">{index + 1}</td>
      <td className="px-3 py-3">
        {/* Nombre del activo (clasificación + marca + modelo) */}
        <div className="text-sm font-medium text-gray-900">
          {linea.ITEM_NOMBRE_COMPLETO || linea.NOMBRE_ACTIVO || 'Sin nombre'}
        </div>
        {/* Error de identidad */}
        {errors?.identidad && (
          <div className="text-xs text-red-500 mt-0.5">⚠️ {errors.identidad}</div>
        )}
        {/* Descripción individual del activo (control.DESCRIPCION) */}
        {linea.control?.DESCRIPCION ? (
          <div className="text-xs text-gray-600 mt-0.5">
            {linea.control.DESCRIPCION}
          </div>
        ) : (
          errors?.descripcion && (
            <div className="text-xs text-red-500 mt-0.5">⚠️ {errors.descripcion}</div>
          )
        )}
        {/* Código patrimonial */}
        <div className="text-xs text-gray-500 mt-0.5">
          Cód: {linea.COD_PATRIMONIAL || linea.CODIGOS_COMBINADOS || 'S/C'}
        </div>
        {/* Badge de tipo: Fijo / Consumible */}
        <div className="mt-1">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
            linea.ES_ACTIVO_FIJO 
              ? 'bg-indigo-50 text-indigo-600' 
              : 'bg-orange-50 text-orange-600'
          }`}>
            {linea.ES_ACTIVO_FIJO ? 'Activo Fijo' : 'Consumible'}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 w-24">
        {/* Cantidad: bloqueada a 1 si es fijo, editable si es consumible */}
        {linea.ES_ACTIVO_FIJO ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              value={1}
              disabled
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <span className="text-xs text-gray-400" title="Activo fijo: cantidad siempre 1">🔒</span>
          </div>
        ) : (
          <input
            type="number"
            min="1"
            value={linea.CANTIDAD || 1}
            onChange={e => set('CANTIDAD', parseInt(e.target.value) || 1)}
            className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none ${errors?.CANTIDAD ? 'border-red-300' : 'border-gray-200'}`}
          />
        )}
        {errors?.CANTIDAD && <p className="text-xs text-red-500 mt-0.5">{errors.CANTIDAD}</p>}
      </td>
      <td className="px-3 py-3 w-28">
        <input
          type="number"
          step="0.01"
          min="0"
          value={linea.PRECIO_UNITARIO || ''}
          onChange={e => set('PRECIO_UNITARIO', e.target.value ? parseFloat(e.target.value) : null)}
          placeholder="0.00"
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none"
        />
      </td>
      <td className="px-3 py-3 w-36">
        <select
          value={linea.ESTADO_CONSERVADO || 'Bueno'}
          onChange={e => set('ESTADO_CONSERVADO', e.target.value)}
          className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none ${errors?.ESTADO_CONSERVADO ? 'border-red-300' : 'border-gray-200'} bg-white`}
        >
          {ESTADOS_CONSERVACION.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        {errors?.ESTADO_CONSERVADO && <p className="text-xs text-red-500 mt-0.5">{errors.ESTADO_CONSERVADO}</p>}
      </td>
      <td className="px-3 py-3 min-w-[180px]">
        <input
          type="text"
          value={linea.OBSERVACIONES || ''}
          onChange={e => set('OBSERVACIONES', e.target.value)}
          placeholder="Notas sobre este activo..."
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none"
        />
      </td>
      <td className="px-3 py-3 w-12 text-center">
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
          title="Eliminar activo (solo si no está confirmado)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

// Documento tipo boleta/NEA
function DocumentoEntrada({ cabecera, almacenes, proveedores, externos, empleados }) {
  const almacen = almacenes.find(a => a.ID_ALMACEN === cabecera.ID_ALMACEN_DESTINO);
  const proveedor = proveedores.find(p => p.ID_PROVEEDOR === cabecera.ID_PROVEEDOR);
  const externo = externos.find(e => e.ID_EXTERNO === cabecera.ID_EXTERNO);
  const empleado = empleados.find(e => e.ID_EMPLEADO === cabecera.ID_EMPLEADO_RECEPTOR);

  const esOrdenCompra = cabecera.TIPO_ENTRADA === 'Orden de Compra';
  const fechaEmisionStr = cabecera.FECHA_EMISION
    ? new Date(cabecera.FECHA_EMISION).toLocaleDateString('es-PE')
    : '—';
  const fechaDocStr = cabecera.FECHA_DOCUMENTO
    ? new Date(cabecera.FECHA_DOCUMENTO).toLocaleDateString('es-PE')
    : null;

  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
      {/* Header tipo documento */}
      <div className="bg-gray-50 border-b border-gray-300 px-4 py-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">NOTA DE ENTRADA AL ALMACÉN</div>
            <div className="text-xl font-bold text-gray-900 mt-1">ENTRADA {cabecera.CODIGO_ENTRADA}</div>
          </div>
          <div className="text-right text-sm">
            <div className="flex gap-4">
              <div>
                <span className="text-gray-500 text-xs">NEA:</span>
                <div className="font-semibold">{cabecera.NRO_NEA || '—'}</div>
              </div>
              <div>
                <span className="text-gray-500 text-xs">Fecha Emisión:</span>
                <div className="font-semibold">{fechaEmisionStr}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Datos de origen y destino */}
      <div className="grid grid-cols-2 border-b border-gray-300">
        {/* Origen */}
        <div className="px-4 py-3 border-r border-gray-300">
          <div className="text-xs text-gray-500 uppercase mb-2">ORIGEN</div>
          <div className="text-sm space-y-1">
            <div className="font-medium">{cabecera.TIPO_ENTRADA}</div>
            {esOrdenCompra ? (
              <>
                {cabecera.NRO_ORDEN_COMPRA && (
                  <div className="text-gray-600">
                    <span className="text-gray-500 text-xs">OS: </span>
                    {cabecera.NRO_ORDEN_COMPRA}
                  </div>
                )}
                {fechaDocStr && (
                  <div className="text-gray-600">
                    <span className="text-gray-500 text-xs">Fecha Doc.: </span>
                    {fechaDocStr}
                  </div>
                )}
                <div className="text-gray-700 font-medium mt-1">{proveedor?.NOMBRE_PROVEEDOR || 'Sin proveedor'}</div>
                {proveedor?.RUC && <div className="text-gray-500 text-xs">RUC: {proveedor.RUC}</div>}
              </>
            ) : (
              <>
                {/* Nombre completo del donante */}
                <div className="text-gray-700 font-medium">
                  {externo?.ES_PERSONA_JURIDICA
                    ? externo?.NOMBRE_O_ORGANIZACION
                    : `${externo?.NOMBRE_O_ORGANIZACION || ''} ${externo?.APELLIDO_O_TIPO_SOCIEDAD || ''}`.trim()
                  }
                </div>
                {/* DNI/RUC */}
                {externo?.DNI_RUC && (
                  <div className="text-gray-500 text-xs">
                    {externo?.ES_PERSONA_JURIDICA ? 'RUC' : 'DNI'}: {externo.DNI_RUC}
                  </div>
                )}
                {/* Tipo de persona */}
                <div className="text-gray-500 text-xs">
                  {externo?.ES_PERSONA_JURIDICA ? 'Persona Jurídica' : 'Persona Natural'}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Destino */}
        <div className="px-4 py-3">
          <div className="text-xs text-gray-500 uppercase mb-2">DESTINO</div>
          <div className="text-sm">
            <div className="font-medium">{almacen?.NOMBRE_ALMACEN || 'Sin almacén'}</div>
            {almacen?.INFRAESTRUCTURA && (
              <div className="text-gray-600">{almacen.INFRAESTRUCTURA}</div>
            )}
            {almacen?.TIPO_INFRAESTRUCTURA && (
              <div className="text-gray-500 text-xs">{almacen.TIPO_INFRAESTRUCTURA}</div>
            )}
            {empleado && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <span className="text-gray-500 text-xs">Receptor: </span>
                <span className="text-gray-700">{empleado.EMPLEADO_NOMBRE_COMPLETO || empleado.NOMBRE_COMPLETO}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notas */}
      {cabecera.NOTAS && (
        <div className="px-4 py-2 border-b border-gray-300 bg-gray-50">
          <span className="text-xs text-gray-500">Notas: </span>
          <span className="text-sm text-gray-700">{cabecera.NOTAS}</span>
        </div>
      )}
    </div>
  );
}

export function PasoEntradaActivos({
  cabecera,
  lineas,
  setLineas,
  errors,
  onActivosChange
}) {
  const [almacenes, setAlmacenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [externos, setExternos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);

  // Función para recargar datos
  const reloadDatos = async () => {
    setRefreshing(true);
    await Promise.all([
      db.select('vw_almacenes_por_infraestructura', { ALMACEN_ACTIVO: true }, [
        'ID_ALMACEN', 'NOMBRE_ALMACEN', 'INFRAESTRUCTURA', 'TIPO_INFRAESTRUCTURA'
      ]).then(r => setAlmacenes(r || [])),

      db.select('PROVEEDORES', { ACTIVO: true }, ['ID_PROVEEDOR', 'NOMBRE_PROVEEDOR', 'RUC']).then(r => setProveedores(r || [])),
      
      db.select('EXTERNOS', { ACTIVO: true }, [
        'ID_EXTERNO', 'NOMBRE_O_ORGANIZACION', 'APELLIDO_O_TIPO_SOCIEDAD',
        'DNI_RUC', 'ES_PERSONA_JURIDICA'
      ]).then(r => setExternos(r || [])),

      db.select('vw_empleados_completo', { EMPLEADO_ACTIVO: true }, [
        'ID_EMPLEADO', 'EMPLEADO_NOMBRE_COMPLETO', 'UBICACION'
      ]).then(r => setEmpleados(r || []))
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    reloadDatos();
  }, []);

  // Agregar nuevo activo desde el modal (modo preview - sin BD)
  const handleActivoCreado = (activoCreado) => {
    const nuevaLinea = {
      // ID temporal para frontend (no hay ID real de BD aún)
      tempId: activoCreado.tempId,
      // Datos de identidad (para crear en paso 2 de guardado)
      modoNueva: activoCreado.modoNueva,
      identidad: activoCreado.identidad,
      // Datos de control (para crear en paso 2 de guardado)
      control: activoCreado.control,
      // Datos de línea de entrada
      CANTIDAD: activoCreado.control.CANTIDAD ?? 1,
      PRECIO_UNITARIO: null,
      ESTADO_CONSERVADO: activoCreado.control.ESTADO || 'Bueno',
      OBSERVACIONES: '',
      // Para mostrar en tabla
      ITEM_NOMBRE_COMPLETO: activoCreado.ITEM_NOMBRE_COMPLETO,
      CODIGOS_COMBINADOS: activoCreado.CODIGOS_COMBINADOS,
      ES_ACTIVO_FIJO: activoCreado.control.ES_ACTIVO_FIJO,
    };
    
    const nuevasLineas = [...lineas, nuevaLinea];
    setLineas(nuevasLineas);
    
    if (onActivosChange) {
      onActivosChange(nuevasLineas);
    }
    
    setShowModal(false);
  };

  // Eliminar activo de la línea (solo frontend, no hay nada en BD aún)
  const eliminarActivo = async (index) => {
    const nuevasLineas = lineas.filter((_, i) => i !== index);
    setLineas(nuevasLineas);
    
    if (onActivosChange) {
      onActivosChange(nuevasLineas);
    }
  };

  const actualizarLinea = (index, nuevaLinea) => {
    const nuevasLineas = lineas.map((l, i) => i === index ? nuevaLinea : l);
    setLineas(nuevasLineas);
    
    if (onActivosChange) {
      onActivosChange(nuevasLineas);
    }
  };

  // Calcular totales
  const totalItems = lineas.reduce((sum, l) => sum + (l.CANTIDAD || 0), 0);
  const totalValor = lineas.reduce((sum, l) => sum + ((l.CANTIDAD || 0) * (l.PRECIO_UNITARIO || 0)), 0);

  return (
    <div className="space-y-4">
      {/* Modal para crear activo */}
      <ActivoFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleActivoCreado}
        idAlmacenDestino={cabecera.ID_ALMACEN_DESTINO}
      />

      {/* Documento tipo boleta/NEA */}
      <DocumentoEntrada
        cabecera={cabecera}
        almacenes={almacenes}
        proveedores={proveedores}
        externos={externos}
        empleados={empleados}
      />

      {/* Mensaje de error general */}
      {errors.lineas && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {errors.lineas}
        </div>
      )}

      {/* Tabla de activos creados */}
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
        {/* Header tabla */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 uppercase">Activos de la entrada</span>
              <button
                type="button"
                onClick={reloadDatos}
                disabled={refreshing}
                title="Recargar datos (en caso de fallo)"
                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
              >
                <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <span className="text-xs text-gray-500">{lineas.length} activo(s) · {totalItems} unidad(es)</span>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 w-10">N°</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Activo</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 w-24">Cant.</th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 w-28">Precio Unit.</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 w-36">Estado</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Obs.</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {lineas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-sm mb-1">No hay activos en esta entrada</p>
                    <p className="text-xs text-gray-400">Presione "+ Crear activo" para agregar</p>
                  </td>
                </tr>
              ) : (
                lineas.map((linea, index) => (
                  <FilaActivoCreado
                    key={index}
                    index={index}
                    linea={linea}
                    onChange={actualizarLinea}
                    onRemove={eliminarActivo}
                    errors={errors[`linea_${index}`]}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer tabla con totales */}
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-300 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear activo
          </button>

          {totalValor > 0 && (
            <div className="text-sm">
              <span className="text-gray-500">Total: </span>
              <span className="font-semibold text-gray-900">S/ {totalValor.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
