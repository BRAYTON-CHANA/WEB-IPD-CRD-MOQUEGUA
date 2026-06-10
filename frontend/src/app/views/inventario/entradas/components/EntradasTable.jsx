import React, { useState, useMemo } from 'react';

const TIPO_BADGE = {
  'Donacion':      'bg-purple-100 text-purple-700',
  'Orden de Compra': 'bg-blue-100 text-blue-700',
};

function TipoBadge({ tipo }) {
  const cls = TIPO_BADGE[tipo] || 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {tipo || '—'}
    </span>
  );
}

function EntradasTable({ entradas, onView, onDelete, loading }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const filtrados = useMemo(() => {
    return entradas.filter(e => {
      const texto = busqueda.toLowerCase();
      const matchBusqueda = !busqueda ||
        (e.CODIGO_ENTRADA || '').toLowerCase().includes(texto) ||
        (e.NRO_NEA || '').toLowerCase().includes(texto) ||
        (e.ALMACEN_NOMBRE || '').toLowerCase().includes(texto) ||
        (e.PROVEEDOR_NOMBRE || '').toLowerCase().includes(texto) ||
        (e.EXTERNO_NOMBRE || '').toLowerCase().includes(texto);
      const matchTipo = !filtroTipo || e.TIPO_ENTRADA === filtroTipo;
      return matchBusqueda && matchTipo;
    });
  }, [entradas, busqueda, filtroTipo]);

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-PE');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de filtros */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por código, NEA, almacén..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Todos los tipos</option>
          <option value="Donacion">Donación</option>
          <option value="Orden de Compra">Orden de Compra</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtrados.length} registro{filtrados.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Cargando entradas...</div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-10 h-10 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">{busqueda || filtroTipo ? 'Sin resultados para los filtros aplicados' : 'No hay entradas registradas'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Código</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Tipo</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">NEA</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Almacén</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Origen</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Activos</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.map(entrada => (
                  <tr key={entrada.ID_ENTRADA} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 font-mono text-sm" title={entrada.CODIGO_ENTRADA}>
                        {entrada.CODIGO_ENTRADA}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <TipoBadge tipo={entrada.TIPO_ENTRADA} />
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {entrada.NRO_NEA || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {formatFecha(entrada.FECHA_EMISION)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700" title={entrada.INFRAESTRUCTURA_NOMBRE}>
                        {entrada.ALMACEN_NOMBRE || <span className="text-gray-300">—</span>}
                      </div>
                      {entrada.INFRAESTRUCTURA_NOMBRE && (
                        <div className="text-xs text-gray-500">{entrada.INFRAESTRUCTURA_NOMBRE}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[150px] truncate">
                      {entrada.TIPO_ENTRADA === 'Orden de Compra' ? (
                        <div title={entrada.PROVEEDOR_NOMBRE}>
                          {entrada.PROVEEDOR_NOMBRE || <span className="text-gray-300">Sin proveedor</span>}
                          {entrada.PROVEEDOR_RUC && <div className="text-gray-400">RUC: {entrada.PROVEEDOR_RUC}</div>}
                        </div>
                      ) : (
                        <div title={entrada.EXTERNO_NOMBRE}>
                          {entrada.EXTERNO_NOMBRE || <span className="text-gray-300">Sin donante</span>}
                          {entrada.EXTERNO_TIPO && <div className="text-gray-400">{entrada.EXTERNO_TIPO}</div>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="font-medium text-gray-700">{entrada.CANTIDAD_ACTIVOS || 0}</span>
                        {entrada.TOTAL_ITEMS > 0 && (
                          <span className="text-xs text-gray-400">{entrada.TOTAL_ITEMS} items</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onView?.(entrada)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Ver detalles de entrada"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(entrada)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar entrada"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EntradasTable;
