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

const ESTADOS_CONSERVACION = ['Excelente', 'Bueno', 'Regular', 'Malo', 'Obsoleto'];

export function PasoEntradaCabecera({
  cabecera,
  setCabecera,
  errors
}) {
  const [almacenes, setAlmacenes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [externos, setExternos] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  const reloadAlmacenes = useCallback(async () => {
    const r = await db.select('vw_almacenes_por_infraestructura', { ALMACEN_ACTIVO: true }, [
      'ID_ALMACEN', 'NOMBRE_ALMACEN', 'INFRAESTRUCTURA', 'TIPO_INFRAESTRUCTURA'
    ]);
    setAlmacenes(r || []);
  }, []);

  const reloadProveedores = useCallback(async () => {
    const r = await db.select('PROVEEDORES', { ACTIVO: true }, ['ID_PROVEEDOR', 'NOMBRE_PROVEEDOR', 'RUC']);
    setProveedores(r || []);
  }, []);

  const reloadExternos = useCallback(async () => {
    const r = await db.select('EXTERNOS', { ACTIVO: true }, [
      'ID_EXTERNO', 'NOMBRE_O_ORGANIZACION', 'APELLIDO_O_TIPO_SOCIEDAD',
      'DNI_RUC', 'ES_PERSONA_JURIDICA'
    ]);
    setExternos(r || []);
  }, []);

  const reloadEmpleados = useCallback(async () => {
    const r = await db.select('vw_empleados_completo', { EMPLEADO_ACTIVO: true }, [
      'ID_EMPLEADO', 'EMPLEADO_NOMBRE_COMPLETO', 'UBICACION', 'NOMBRE_OFICINA', 'INFRAESTRUCTURA'
    ]);
    setEmpleados(r || []);
  }, []);

  useEffect(() => {
    Promise.all([reloadAlmacenes(), reloadProveedores(), reloadExternos(), reloadEmpleados()]);
  }, []);

  const set = (field, val) => setCabecera(prev => ({ ...prev, [field]: val }));

  const esOrdenCompra = cabecera.TIPO_ENTRADA === 'Orden de Compra';
  const esDonacion = cabecera.TIPO_ENTRADA === 'Donacion';

  const proveedorLabelFn = opt => `${opt.NOMBRE_PROVEEDOR} (RUC: ${opt.RUC || 'S/R'})`;
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
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-gray-800">Datos del documento</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Código entrada <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={cabecera.CODIGO_ENTRADA || ''}
              onChange={e => set('CODIGO_ENTRADA', e.target.value)}
              placeholder="Ej: ENT-2025-001"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.CODIGO_ENTRADA ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.CODIGO_ENTRADA && <p className="text-xs text-red-500 mt-1">{errors.CODIGO_ENTRADA}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo de entrada <span className="text-red-500">*</span></label>
            <select
              value={cabecera.TIPO_ENTRADA || ''}
              onChange={e => {
                const tipo = e.target.value;
                set('TIPO_ENTRADA', tipo);
                // Limpiar origen al cambiar tipo
                set('ID_PROVEEDOR', null);
                set('ID_EXTERNO', null);
                // Limpiar campos de Orden de Compra si cambia a Donacion
                if (tipo === 'Donacion') {
                  set('NRO_ORDEN_COMPRA', null);
                  set('FECHA_DOCUMENTO', null);
                }
              }}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.TIPO_ENTRADA ? 'border-red-300' : 'border-gray-200'} bg-white`}
            >
              <option value="">Seleccione tipo...</option>
              <option value="Donacion">Donación</option>
              <option value="Orden de Compra">Orden de Compra</option>
            </select>
            {errors.TIPO_ENTRADA && <p className="text-xs text-red-500 mt-1">{errors.TIPO_ENTRADA}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">N° NEA</label>
            <input
              type="text"
              value={cabecera.NRO_NEA || ''}
              onChange={e => set('NRO_NEA', e.target.value)}
              placeholder="Número de Nota de Entrada"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha emisión <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={cabecera.FECHA_EMISION || ''}
              onChange={e => set('FECHA_EMISION', e.target.value)}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.FECHA_EMISION ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.FECHA_EMISION && <p className="text-xs text-red-500 mt-1">{errors.FECHA_EMISION}</p>}
          </div>

          {esOrdenCompra && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">N° Orden de Compra (OS)</label>
                <input
                  type="text"
                  value={cabecera.NRO_ORDEN_COMPRA || ''}
                  onChange={e => set('NRO_ORDEN_COMPRA', e.target.value)}
                  placeholder="Ej: OS-2025-001"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha documento</label>
                <input
                  type="date"
                  value={cabecera.FECHA_DOCUMENTO || ''}
                  onChange={e => set('FECHA_DOCUMENTO', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Ubicación */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-gray-800">Ubicación destino</h4>
        </div>
        <RefSelect
          label="Almacén destino"
          required
          options={almacenes}
          valueKey="ID_ALMACEN"
          labelKey="NOMBRE_ALMACEN"
          labelFn={almacenLabelFn}
          value={cabecera.ID_ALMACEN_DESTINO}
          onChange={v => set('ID_ALMACEN_DESTINO', v)}
          placeholder="Seleccione almacén..."
          onRefresh={reloadAlmacenes}
          error={errors.ID_ALMACEN_DESTINO}
        />
      </div>

      {/* Origen */}
      {cabecera.TIPO_ENTRADA && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-gray-800">
              Origen: {esOrdenCompra ? 'Proveedor' : esDonacion ? 'Donante externo' : ''}
            </h4>
          </div>

          {esOrdenCompra && (
            <RefSelect
              label="Proveedor"
              required
              options={proveedores}
              valueKey="ID_PROVEEDOR"
              labelKey="NOMBRE_PROVEEDOR"
              labelFn={proveedorLabelFn}
              value={cabecera.ID_PROVEEDOR}
              onChange={v => set('ID_PROVEEDOR', v)}
              placeholder="Seleccione proveedor..."
              onRefresh={reloadProveedores}
              error={errors.ID_PROVEEDOR}
            />
          )}

          {esDonacion && (
            <RefSelect
              label="Donante externo"
              required
              options={externos}
              valueKey="ID_EXTERNO"
              labelKey="NOMBRE_O_ORGANIZACION"
              labelFn={externoLabelFn}
              value={cabecera.ID_EXTERNO}
              onChange={v => set('ID_EXTERNO', v)}
              placeholder="Seleccione donante..."
              onRefresh={reloadExternos}
              error={errors.ID_EXTERNO}
            />
          )}
        </div>
      )}

      {/* Receptor y notas */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-gray-800">Receptor y observaciones</h4>
        </div>
        <div className="space-y-4">
          <RefSelect
            label="Empleado receptor"
            options={empleados}
            valueKey="ID_EMPLEADO"
            labelKey="EMPLEADO_NOMBRE_COMPLETO"
            labelFn={empleadoLabelFn}
            value={cabecera.ID_EMPLEADO_RECEPTOR}
            onChange={v => set('ID_EMPLEADO_RECEPTOR', v)}
            placeholder="Sin receptor asignado..."
            onRefresh={reloadEmpleados}
          />

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notas</label>
            <textarea
              value={cabecera.NOTAS || ''}
              onChange={e => set('NOTAS', e.target.value)}
              rows={3}
              placeholder="Notas adicionales sobre la entrada..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
