import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/shared/api';
import { RefSelect } from '../../../activos/components/ui/FormFields';

const ESTADOS_CONSERVACION = ['Excelente', 'Bueno', 'Regular', 'Malo', 'Obsoleto'];

// Fila de tabla mostrando activo seleccionado para salir
function FilaActivoSalida({
  index,
  linea,
  onChange,
  onRemove,
  errors,
  maxCantidad
}) {
  const set = (field, val) => onChange(index, { ...linea, [field]: val });
  const esFijo = linea.ES_ACTIVO_FIJO;

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-3 py-3 text-center text-xs text-gray-500">{index + 1}</td>
      <td className="px-3 py-3">
        {/* Nombre del activo */}
        <div className="text-sm font-medium text-gray-900">
          {linea.ITEM_NOMBRE_COMPLETO || 'Sin nombre'}
        </div>
        {/* Descripción del activo */}
        {linea.DESCRIPCION && (
          <div className="text-xs text-gray-600 mt-0.5">
            {linea.DESCRIPCION}
          </div>
        )}
        {/* Código patrimonial/serial */}
        <div className="text-xs text-gray-500 mt-0.5">
          Cód: {linea.COD_PATRIMONIAL || linea.NUMERO_SERIAL || 'S/C'}
        </div>
        {/* Badge de tipo */}
        <div className="mt-1">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
            esFijo
              ? 'bg-indigo-50 text-indigo-600'
              : 'bg-orange-50 text-orange-600'
          }`}>
            {esFijo ? 'Activo Fijo' : 'Consumible'}
          </span>
        </div>
      </td>
      <td className="px-3 py-3 w-24">
        {/* Cantidad: bloqueada a 1 si es fijo, editable si es consumible */}
        {esFijo ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max="1"
              value={1}
              disabled
              className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <span className="text-xs text-gray-400" title="Activo fijo: cantidad siempre 1">🔒</span>
          </div>
        ) : (
          <div>
            <input
              type="number"
              min="1"
              max={maxCantidad}
              value={linea.CANTIDAD || 1}
              onChange={e => {
                const val = parseInt(e.target.value) || 1;
                // Limitar al máximo disponible
                const limitedVal = Math.min(val, maxCantidad);
                set('CANTIDAD', limitedVal);
              }}
              className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none ${
                errors?.CANTIDAD ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            <div className="text-xs text-gray-400 mt-0.5">
              Máx: {maxCantidad}
            </div>
          </div>
        )}
        {errors?.CANTIDAD && <p className="text-xs text-red-500 mt-0.5">{errors.CANTIDAD}</p>}
      </td>
      <td className="px-3 py-3 w-28">
        <select
          value={linea.ESTADO_CONSERVADO || 'Bueno'}
          onChange={e => set('ESTADO_CONSERVADO', e.target.value)}
          className={`w-full px-2 py-1.5 text-sm border rounded focus:outline-none ${
            errors?.ESTADO_CONSERVADO ? 'border-red-300' : 'border-gray-200'
          } bg-white`}
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
          title="Eliminar activo de la salida"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </tr>
  );
}

// Documento tipo boleta/PECOSA
function DocumentoSalida({ cabecera, almacenes, externos, empleados }) {
  const almacen = almacenes.find(a => a.ID_ALMACEN === cabecera.ID_ALMACEN_ORIGEN);
  const externo = externos.find(e => e.ID_EXTERNO === cabecera.ID_EXTERNO);
  const empleado = empleados.find(e => e.ID_EMPLEADO === cabecera.ID_EMPLEADO_ENTREGA);

  const fechaEmisionStr = cabecera.FECHA_EMISION
    ? new Date(cabecera.FECHA_EMISION).toLocaleDateString('es-PE')
    : '—';

  const externoLabel = externo?.ES_PERSONA_JURIDICA
    ? externo?.NOMBRE_O_ORGANIZACION
    : `${externo?.NOMBRE_O_ORGANIZACION || ''} ${externo?.APELLIDO_O_TIPO_SOCIEDAD || ''}`.trim();

  return (
    <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
      {/* Header tipo documento */}
      <div className="bg-red-50 border-b border-gray-300 px-4 py-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-red-600 uppercase tracking-wide">NOTA DE SALIDA DEL ALMACÉN</div>
            <div className="text-xl font-bold text-gray-900 mt-1">SALIDA {cabecera.CODIGO_SALIDA}</div>
          </div>
          <div className="text-right text-sm">
            <div className="flex gap-4">
              <div>
                <span className="text-gray-500 text-xs">PECOSA:</span>
                <div className="font-semibold">{cabecera.NRO_PECOSA || '—'}</div>
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
          <div className="text-xs text-gray-500 uppercase mb-2">ORIGEN (Almacén)</div>
          <div className="text-sm">
            <div className="font-medium">{almacen?.NOMBRE_ALMACEN || 'Sin almacén'}</div>
            {almacen?.INFRAESTRUCTURA && (
              <div className="text-gray-600">{almacen.INFRAESTRUCTURA}</div>
            )}
          </div>
        </div>

        {/* Destino */}
        <div className="px-4 py-3">
          <div className="text-xs text-gray-500 uppercase mb-2">DESTINATARIO</div>
          <div className="text-sm space-y-1">
            <div className="font-medium">{externoLabel || 'Sin destinatario'}</div>
            {externo?.DNI_RUC && (
              <div className="text-gray-500 text-xs">
                {externo?.ES_PERSONA_JURIDICA ? 'RUC' : 'DNI'}: {externo.DNI_RUC}
              </div>
            )}
            {cabecera.TIPO_SALIDA && (
              <div className="text-gray-500 text-xs">Tipo: {cabecera.TIPO_SALIDA}</div>
            )}
          </div>
        </div>
      </div>

      {/* Empleado que entrega */}
      {empleado && (
        <div className="px-4 py-2 bg-gray-50 text-xs">
          <span className="text-gray-500">Entregado por:</span>
          <span className="ml-2 font-medium">{empleado.EMPLEADO_NOMBRE_COMPLETO || `${empleado.EMPLEADO_NOMBRES || ''} ${empleado.EMPLEADO_APELLIDOS || ''}`.trim()}</span>
        </div>
      )}
    </div>
  );
}

// Selector de activos disponibles
function SelectorActivos({ isOpen, onClose, onSelect, idAlmacen, activosExcluidos }) {
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos', 'fijo', 'consumible'

  useEffect(() => {
    if (isOpen && idAlmacen) {
      cargarActivos();
    }
  }, [isOpen, idAlmacen]);

  const cargarActivos = async () => {
    setLoading(true);
    try {
      // Obtener activos del almacén que no estén dados de baja
      const r = await db.select('vw_activos_completo', {
        ID_ALMACEN_ASIGNADO: idAlmacen,
        DADO_DE_BAJA: false,
        ACTIVO: true
      }, [
        'ID_ACTIVO_CONTROL', 'ID_ACTIVO_IDENTIDAD', 'ITEM_NOMBRE_COMPLETO',
        'DESCRIPCION', 'COD_PATRIMONIAL', 'NUMERO_SERIAL',
        'ES_ACTIVO_FIJO', 'CANTIDAD', 'ESTADO'
      ]);

      // Filtrar los que ya están en la salida
      const excluirIds = new Set(activosExcluidos.map(a => a.ID_ACTIVO_CONTROL));
      const filtrados = (r || []).filter(a => !excluirIds.has(a.ID_ACTIVO_CONTROL));

      setActivos(filtrados);
    } catch (err) {
      console.error('Error cargando activos:', err);
    } finally {
      setLoading(false);
    }
  };

  const activosFiltrados = activos.filter(a => {
    // Filtro por búsqueda
    const matchBusqueda = busqueda === '' ||
      (a.ITEM_NOMBRE_COMPLETO?.toLowerCase() || '').includes(busqueda.toLowerCase()) ||
      (a.DESCRIPCION?.toLowerCase() || '').includes(busqueda.toLowerCase()) ||
      (a.COD_PATRIMONIAL || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (a.NUMERO_SERIAL || '').toLowerCase().includes(busqueda.toLowerCase());

    // Filtro por tipo
    const matchTipo = filtroTipo === 'todos' ||
      (filtroTipo === 'fijo' && a.ES_ACTIVO_FIJO) ||
      (filtroTipo === 'consumible' && !a.ES_ACTIVO_FIJO);

    return matchBusqueda && matchTipo;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Seleccionar Activos</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filtros */}
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex gap-3">
          <input
            type="text"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            placeholder="🔍 Buscar activo..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white"
          >
            <option value="todos">Todos los tipos</option>
            <option value="fijo">Solo Fijos</option>
            <option value="consumible">Solo Consumibles</option>
          </select>
        </div>

        {/* Lista de activos */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando activos...</div>
          ) : activosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p>No hay activos disponibles</p>
              <p className="text-xs mt-1">El almacén no tiene activos o ya fueron agregados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activosFiltrados.map(activo => (
                <button
                  key={activo.ID_ACTIVO_CONTROL}
                  onClick={() => onSelect(activo)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activo.ITEM_NOMBRE_COMPLETO}</div>
                      {activo.DESCRIPCION && (
                        <div className="text-xs text-gray-600 mt-0.5">{activo.DESCRIPCION}</div>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          activo.ES_ACTIVO_FIJO
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'bg-orange-50 text-orange-600'
                        }`}>
                          {activo.ES_ACTIVO_FIJO ? 'Fijo' : 'Consumible'}
                        </span>
                        {!activo.ES_ACTIVO_FIJO && (
                          <span className="text-xs text-gray-500">
                            Cantidad disponible: <strong>{activo.CANTIDAD}</strong>
                          </span>
                        )}
                        {activo.COD_PATRIMONIAL && (
                          <span className="text-xs text-gray-500">
                            Patrimonial: {activo.COD_PATRIMONIAL}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {activosFiltrados.length} activo{activosFiltrados.length !== 1 ? 's' : ''} disponible{activosFiltrados.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal
export function PasoSalidaActivos({ cabecera, lineas, setLineas, errors }) {
  const [showSelector, setShowSelector] = useState(false);
  const [almacenes, setAlmacenes] = useState([]);
  const [externos, setExternos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [activosDisponibles, setActivosDisponibles] = useState({}); // Mapa ID -> cantidad disponible

  // Cargar datos de referencia
  useEffect(() => {
    const cargarDatos = async () => {
      const [a, e, emp] = await Promise.all([
        db.select('vw_almacenes_por_infraestructura', { ALMACEN_ACTIVO: true }, [
          'ID_ALMACEN', 'NOMBRE_ALMACEN', 'INFRAESTRUCTURA'
        ]),
        db.select('EXTERNOS', { ACTIVO: true }, [
          'ID_EXTERNO', 'NOMBRE_O_ORGANIZACION', 'APELLIDO_O_TIPO_SOCIEDAD',
          'DNI_RUC', 'ES_PERSONA_JURIDICA'
        ]),
        db.select('vw_empleados_completo', { EMPLEADO_ACTIVO: true }, [
          'ID_EMPLEADO', 'EMPLEADO_NOMBRE_COMPLETO', 'EMPLEADO_NOMBRES', 'EMPLEADO_APELLIDOS'
        ])
      ]);
      setAlmacenes(a || []);
      setExternos(e || []);
      setEmpleados(emp || []);
    };
    cargarDatos();
  }, []);

  // Cargar cantidades disponibles de activos
  useEffect(() => {
    const cargarCantidades = async () => {
      if (!cabecera.ID_ALMACEN_ORIGEN) return;

      try {
        const r = await db.select('ACTIVOS_CONTROL', {
          ID_ALMACEN_ASIGNADO: cabecera.ID_ALMACEN_ORIGEN,
          DADO_DE_BAJA: false,
          ACTIVO: true
        }, ['ID_ACTIVO_CONTROL', 'CANTIDAD']);

        const map = {};
        (r || []).forEach(a => {
          map[a.ID_ACTIVO_CONTROL] = a.CANTIDAD;
        });
        setActivosDisponibles(map);
      } catch (err) {
        console.error('Error cargando cantidades:', err);
      }
    };
    cargarCantidades();
  }, [cabecera.ID_ALMACEN_ORIGEN]);

  // Agregar activo seleccionado
  const handleAgregarActivo = (activo) => {
    const nuevaLinea = {
      ID_ACTIVO_CONTROL: activo.ID_ACTIVO_CONTROL,
      ID_ACTIVO_IDENTIDAD: activo.ID_ACTIVO_IDENTIDAD,
      ITEM_NOMBRE_COMPLETO: activo.ITEM_NOMBRE_COMPLETO,
      DESCRIPCION: activo.DESCRIPCION,
      COD_PATRIMONIAL: activo.COD_PATRIMONIAL,
      NUMERO_SERIAL: activo.NUMERO_SERIAL,
      ES_ACTIVO_FIJO: activo.ES_ACTIVO_FIJO,
      CANTIDAD: activo.ES_ACTIVO_FIJO ? 1 : 1, // Default 1, editable si es consumible
      CANTIDAD_DISPONIBLE: activo.CANTIDAD, // Para validación
      ESTADO_CONSERVADO: 'Bueno',
      OBSERVACIONES: '',
    };

    setLineas([...lineas, nuevaLinea]);
    setShowSelector(false);
  };

  // Actualizar línea
  const actualizarLinea = (index, nuevaLinea) => {
    const nuevasLineas = lineas.map((l, i) => i === index ? nuevaLinea : l);
    setLineas(nuevasLineas);
  };

  // Eliminar línea
  const eliminarLinea = (index) => {
    const nuevasLineas = lineas.filter((_, i) => i !== index);
    setLineas(nuevasLineas);
  };

  // Calcular totales
  const totalItems = lineas.reduce((sum, l) => sum + (l.CANTIDAD || 0), 0);
  const totalFijos = lineas.filter(l => l.ES_ACTIVO_FIJO).length;
  const totalConsumibles = lineas.filter(l => !l.ES_ACTIVO_FIJO).length;

  return (
    <div className="space-y-4">
      {/* Selector de activos */}
      <SelectorActivos
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleAgregarActivo}
        idAlmacen={cabecera.ID_ALMACEN_ORIGEN}
        activosExcluidos={lineas}
      />

      {/* Documento tipo boleta/PECOSA */}
      <DocumentoSalida
        cabecera={cabecera}
        almacenes={almacenes}
        externos={externos}
        empleados={empleados}
      />

      {/* Mensaje de error general */}
      {errors.lineas && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm">
          {errors.lineas}
        </div>
      )}

      {/* Botón agregar activo */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-gray-800">Activos a salir</h4>
          <p className="text-xs text-gray-500">
            {lineas.length === 0
              ? 'Agregue al menos un activo para continuar'
              : `${totalItems} unidad${totalItems !== 1 ? 'es' : ''} (${totalFijos} fijo${totalFijos !== 1 ? 's' : ''}, ${totalConsumibles} consumible${totalConsumibles !== 1 ? 's' : ''})`
            }
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowSelector(true)}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Activo
        </button>
      </div>

      {/* Tabla de activos seleccionados */}
      {lineas.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-10">#</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Activo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-24">Cant.</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 w-28">Estado</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Observaciones</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((linea, index) => (
                <FilaActivoSalida
                  key={linea.ID_ACTIVO_CONTROL || index}
                  index={index}
                  linea={linea}
                  onChange={actualizarLinea}
                  onRemove={eliminarLinea}
                  errors={errors[`linea_${index}`]}
                  maxCantidad={linea.CANTIDAD_DISPONIBLE || 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
