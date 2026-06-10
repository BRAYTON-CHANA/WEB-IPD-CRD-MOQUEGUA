import React, { useState, useEffect } from 'react';
import { db } from '@/shared/api';
import { exportarSalidaExcel } from '../../utils/exportarSalidaExcel';

export function SalidaDetalleModal({ salida, onClose }) {
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!salida?.ID_SALIDA) return;

    const cargarActivos = async () => {
      try {
        setLoading(true);
        // Cargar activos de la salida usando la vista
        const resultado = await db.select('vw_salidas_activos_completo', { ID_SALIDA: salida.ID_SALIDA });
        setActivos(resultado || []);
      } catch (err) {
        setError('Error al cargar activos: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarActivos();
  }, [salida?.ID_SALIDA]);

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-PE');
  };

  const handleExportarExcel = async () => {
    try {
      await exportarSalidaExcel(salida, activos);
    } catch (err) {
      alert('Error al exportar Excel: ' + err.message);
    }
  };

  if (!salida) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Detalle de Salida</h2>
            <p className="text-xs text-gray-500 mt-0.5">{salida.CODIGO_SALIDA}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportarExcel}
              disabled={loading || activos.length === 0}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exportar Excel
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Info de cabecera */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Datos de la Salida</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Código:</span>
                <p className="font-medium">{salida.CODIGO_SALIDA}</p>
              </div>
              <div>
                <span className="text-gray-500">Tipo:</span>
                <p className="font-medium">{salida.TIPO_SALIDA}</p>
              </div>
              <div>
                <span className="text-gray-500">PECOSA:</span>
                <p className="font-medium">{salida.NRO_PECOSA || '—'}</p>
              </div>
              <div>
                <span className="text-gray-500">Fecha:</span>
                <p className="font-medium">{formatFecha(salida.FECHA_EMISION)}</p>
              </div>
              <div>
                <span className="text-gray-500">Almacén Origen:</span>
                <p className="font-medium">{salida.ALMACEN_NOMBRE || '—'}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Destinatario:</span>
                <p className="font-medium">
                  {salida.EXTERNO_NOMBRE || 'Sin destinatario'}
                </p>
              </div>
              {salida.NOTAS && (
                <div className="col-span-2 md:col-span-4">
                  <span className="text-gray-500">Notas:</span>
                  <p className="font-medium">{salida.NOTAS}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tabla de activos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Activos incluidos ({activos.length})
            </h3>

            {loading ? (
              <div className="text-center py-8 text-gray-400">Cargando activos...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : activos.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No hay activos registrados</div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">N°</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Nombre</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Marca/Modelo</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Código</th>
                      <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Cant.</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activos.map((a, i) => (
                      <tr key={a.ID_SALIDA_ACTIVO || i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-900">{a.ITEM_NOMBRE_COMPLETO || '—'}</div>
                          {a.DESCRIPCION_CONTROL && (
                            <div className="text-xs text-gray-500">{a.DESCRIPCION_CONTROL}</div>
                          )}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {[a.MARCA, a.MODELO].filter(Boolean).join(' ') || '—'}
                        </td>
                        <td className="px-3 py-2 text-gray-600 font-mono text-xs">
                          {a.COD_PATRIMONIAL || a.CODIGOS_COMBINADOS || 'S/C'}
                        </td>
                        <td className="px-3 py-2 text-center">{a.CANTIDAD || 1}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs ${
                            a.ESTADO_CONSERVADO === 'Excelente' ? 'bg-green-100 text-green-700' :
                            a.ESTADO_CONSERVADO === 'Bueno' ? 'bg-blue-100 text-blue-700' :
                            a.ESTADO_CONSERVADO === 'Regular' ? 'bg-yellow-100 text-yellow-700' :
                            a.ESTADO_CONSERVADO === 'Malo' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {a.ESTADO_CONSERVADO || '—'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
