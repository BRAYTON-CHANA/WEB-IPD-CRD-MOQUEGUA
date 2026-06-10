import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/shared/api';
import { RefSelect } from '../../../activos/components/ui/FormFields';

// Estilo para hacer visible el icono del date picker
const datePickerStyle = `
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(0.4);
    cursor: pointer;
  }
`;

export function PasoSalidaCabecera({
  cabecera,
  setCabecera,
  errors
}) {
  const [almacenes, setAlmacenes] = useState([]);
  const [externos, setExternos] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  const reloadAlmacenes = useCallback(async () => {
    try {
      console.log('[PasoSalidaCabecera] Cargando almacenes...');
      const r = await db.select('vw_almacenes_por_infraestructura', { ALMACEN_ACTIVO: true }, [
        'ID_ALMACEN', 'NOMBRE_ALMACEN', 'INFRAESTRUCTURA', 'TIPO_INFRAESTRUCTURA'
      ]);
      console.log('[PasoSalidaCabecera] Almacenes cargados:', r?.length || 0, r);
      setAlmacenes(r || []);
    } catch (err) {
      console.error('[PasoSalidaCabecera] Error cargando almacenes:', err);
      setAlmacenes([]);
    }
  }, []);

  const reloadExternos = useCallback(async () => {
    try {
      console.log('[PasoSalidaCabecera] Cargando externos...');
      const r = await db.select('EXTERNOS', { ACTIVO: true }, [
        'ID_EXTERNO', 'NOMBRE_O_ORGANIZACION', 'APELLIDO_O_TIPO_SOCIEDAD',
        'DNI_RUC', 'ES_PERSONA_JURIDICA'
      ]);
      console.log('[PasoSalidaCabecera] Externos cargados:', r?.length || 0, r);
      setExternos(r || []);
    } catch (err) {
      console.error('[PasoSalidaCabecera] Error cargando externos:', err);
      setExternos([]);
    }
  }, []);

  const reloadEmpleados = useCallback(async () => {
    try {
      console.log('[PasoSalidaCabecera] Cargando empleados...');
      const r = await db.select('vw_empleados_completo', { EMPLEADO_ACTIVO: true }, [
        'ID_EMPLEADO', 'EMPLEADO_NOMBRE_COMPLETO', 'UBICACION', 'NOMBRE_OFICINA', 'INFRAESTRUCTURA'
      ]);
      console.log('[PasoSalidaCabecera] Empleados cargados:', r?.length || 0, r);
      setEmpleados(r || []);
    } catch (err) {
      console.error('[PasoSalidaCabecera] Error cargando empleados:', err);
      setEmpleados([]);
    }
  }, []);

  useEffect(() => {
    console.log('[PasoSalidaCabecera] useEffect - cargando datos...');
    Promise.all([reloadAlmacenes(), reloadExternos(), reloadEmpleados()])
      .then(() => console.log('[PasoSalidaCabecera] Todos los datos cargados'))
      .catch(err => console.error('[PasoSalidaCabecera] Error en carga:', err));
  }, []);

  const set = (field, val) => setCabecera(prev => ({ ...prev, [field]: val }));

  const externoLabelFn = opt => {
    const nombre = opt.ES_PERSONA_JURIDICA
      ? opt.NOMBRE_O_ORGANIZACION
      : `${opt.NOMBRE_O_ORGANIZACION || ''} ${opt.APELLIDO_O_TIPO_SOCIEDAD || ''}`.trim();
    const doc = opt.DNI_RUC ? ` (${opt.ES_PERSONA_JURIDICA ? 'RUC' : 'DNI'}: ${opt.DNI_RUC})` : '';
    return nombre + doc;
  };

  const almacenLabelFn = opt => `${opt.NOMBRE_ALMACEN} (${opt.INFRAESTRUCTURA || 'Sin infra'})`;
  const empleadoLabelFn = opt => `${opt.EMPLEADO_NOMBRE_COMPLETO} (${opt.UBICACION || 'Sin ubicación'})`;

  return (
    <div className="space-y-5">
      <style>{datePickerStyle}</style>
      
      {/* Documento */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Documento de Salida</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de Salida <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={cabecera.CODIGO_SALIDA}
              onChange={e => set('CODIGO_SALIDA', e.target.value)}
              placeholder="ej: SAL-2025-001"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            {errors.CODIGO_SALIDA && (
              <p className="mt-1 text-xs text-red-500">{errors.CODIGO_SALIDA}</p>
            )}
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Salida <span className="text-red-500">*</span>
            </label>
            <select
              value={cabecera.TIPO_SALIDA}
              onChange={e => set('TIPO_SALIDA', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
            >
              <option value="Donacion">Donación</option>
            </select>
            <p className="mt-1 text-xs text-gray-400">Entrega definitiva a externo</p>
          </div>

          {/* PECOSA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              N° PECOSA
            </label>
            <input
              type="text"
              value={cabecera.NRO_PECOSA}
              onChange={e => set('NRO_PECOSA', e.target.value)}
              placeholder="Número de Pedido Comprobante de Salida"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          {/* Fecha Emisión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Emisión <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={cabecera.FECHA_EMISION}
              onChange={e => set('FECHA_EMISION', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            {errors.FECHA_EMISION && (
              <p className="mt-1 text-xs text-red-500">{errors.FECHA_EMISION}</p>
            )}
          </div>

          {/* Fecha Documento - OCULTO por ahora, se envía null */}
          {/*
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha del Documento Físico
            </label>
            <input
              type="date"
              value={cabecera.FECHA_DOCUMENTO}
              onChange={e => set('FECHA_DOCUMENTO', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>
          */}
        </div>
      </div>

      {/* Almacén y Destino */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Origen y Destino</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Almacén Origen */}
          <div>
            <RefSelect
              label="Almacén Origen"
              required
              options={almacenes}
              value={cabecera.ID_ALMACEN_ORIGEN}
              onChange={val => set('ID_ALMACEN_ORIGEN', val)}
              valueKey="ID_ALMACEN"
              labelFn={almacenLabelFn}
              onRefresh={reloadAlmacenes}
              placeholder="Seleccione el almacén de origen..."
              error={errors.ID_ALMACEN_ORIGEN}
            />
            <p className="mt-1 text-xs text-gray-400">De este almacén saldrán los activos</p>
          </div>

          {/* Destinatario Externo */}
          <div>
            <RefSelect
              label="Destinatario Externo"
              required
              options={externos}
              value={cabecera.ID_EXTERNO}
              onChange={val => set('ID_EXTERNO', val)}
              valueKey="ID_EXTERNO"
              labelFn={externoLabelFn}
              onRefresh={reloadExternos}
              placeholder="Seleccione el destinatario..."
              error={errors.ID_EXTERNO}
            />
            <p className="mt-1 text-xs text-gray-400">Persona u organización que recibe los activos</p>
          </div>
        </div>
      </div>

      {/* Responsable */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Responsable</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Empleado que entrega */}
          <div>
            <RefSelect
              label="Empleado que Entrega"
              options={empleados}
              value={cabecera.ID_EMPLEADO_ENTREGA}
              onChange={val => set('ID_EMPLEADO_ENTREGA', val)}
              valueKey="ID_EMPLEADO"
              labelFn={empleadoLabelFn}
              onRefresh={reloadEmpleados}
              placeholder="Seleccione el empleado..."
            />
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Notas</h3>
        </div>

        <textarea
          value={cabecera.NOTAS}
          onChange={e => set('NOTAS', e.target.value)}
          placeholder="Observaciones adicionales sobre esta salida..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
        />
      </div>
    </div>
  );
}
