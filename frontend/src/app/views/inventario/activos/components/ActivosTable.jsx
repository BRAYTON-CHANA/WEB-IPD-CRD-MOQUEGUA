import React, { useState, useMemo } from 'react';

const ESTADO_BADGE = {
  'Activo':      'bg-green-100 text-green-700',
  'En préstamo': 'bg-blue-100 text-blue-700',
  'Borrador':    'bg-yellow-100 text-yellow-700',
  'Inactivo':    'bg-gray-100 text-gray-500',
  'Baja':        'bg-red-100 text-red-600',
};

function EstadoBadge({ estado }) {
  const cls = ESTADO_BADGE[estado] || 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {estado || '—'}
    </span>
  );
}

function ActivosTable({ activos, onEdit, onToggleActivo, onDelete, loading }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  const filtrados = useMemo(() => {
    return activos.filter(a => {
      const texto = busqueda.toLowerCase();
      const matchBusqueda = !busqueda ||
        (a.ITEM_NOMBRE_COMPLETO || '').toLowerCase().includes(texto) ||
        (a.CODIGOS_COMBINADOS || '').toLowerCase().includes(texto) ||
        (a.DESCRIPCION || '').toLowerCase().includes(texto) ||
        (a.CLASIFICACION_DESCRIPCION || '').toLowerCase().includes(texto);
      const matchEstado = !filtroEstado || a.ESTADO_DISPLAY === filtroEstado;
      const matchTipo = !filtroTipo ||
        (filtroTipo === 'fijo' && a.ES_ACTIVO_FIJO === true) ||
        (filtroTipo === 'consumible' && a.ES_ACTIVO_FIJO === false);
      return matchBusqueda && matchEstado && matchTipo;
    });
  }, [activos, busqueda, filtroEstado, filtroTipo]);

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
            placeholder="Buscar por nombre, código, serial..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="En préstamo">En préstamo</option>
          <option value="Borrador">Borrador</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Baja">Baja</option>
        </select>
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Todo tipo</option>
          <option value="fijo">Activo Fijo</option>
          <option value="consumible">Consumible</option>
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtrados.length} registro{filtrados.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Cargando activos...</div>
        ) : filtrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <svg className="w-10 h-10 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm">{busqueda || filtroEstado || filtroTipo ? 'Sin resultados para los filtros aplicados' : 'No hay activos registrados'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Código</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Descripción</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Clasificación</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Ubicación</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Responsable</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Cant.</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Observaciones</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.map(activo => (
                  <tr key={activo.ID_ACTIVO_CONTROL} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800 font-mono text-sm" title={activo.CODIGOS_COMBINADOS}>
                        {activo.CODIGOS_COMBINADOS}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {/* Descripción individual del activo (control) */}
                      {activo.DESCRIPCION ? (
                        <div className="text-sm text-gray-800 max-w-[200px] truncate" title={activo.DESCRIPCION}>
                          {activo.DESCRIPCION}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Sin descripción individual</span>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {activo.ESTADO && (
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                            activo.ESTADO === 'Excelente' ? 'bg-green-50 text-green-600' :
                            activo.ESTADO === 'Bueno' ? 'bg-blue-50 text-blue-600' :
                            activo.ESTADO === 'Regular' ? 'bg-yellow-50 text-yellow-600' :
                            activo.ESTADO === 'Malo' ? 'bg-red-50 text-red-600' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {activo.ESTADO}
                          </span>
                        )}
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${activo.ES_ACTIVO_FIJO ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                          {activo.ES_ACTIVO_FIJO ? 'Fijo' : 'Consumible'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-700 max-w-[140px] truncate" title={activo.CLASIFICACION_DESCRIPCION}>
                        {activo.CLASIFICACION_DESCRIPCION || '—'}
                      </div>
                      {activo.CLASIFICACION_CATEGORIA && (
                        <div className="text-xs text-gray-500">{activo.CLASIFICACION_CATEGORIA}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[140px] truncate">
                      {activo.INFRAESTRUCTURA_NOMBRE && (
                        <div title={activo.INFRAESTRUCTURA_NOMBRE}>{activo.INFRAESTRUCTURA_NOMBRE}</div>
                      )}
                      {activo.ALMACEN_NOMBRE && (
                        <div className="text-gray-500" title={activo.ALMACEN_NOMBRE}>{activo.ALMACEN_NOMBRE}</div>
                      )}
                      {!activo.INFRAESTRUCTURA_NOMBRE && !activo.ALMACEN_NOMBRE && (
                        <span className="text-gray-300">Sin ubicación</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[140px] truncate" title={activo.EMPLEADO_NOMBRE}>
                      {activo.EMPLEADO_NOMBRE || <span className="text-gray-300">Sin asignar</span>}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 font-medium">
                      {activo.CANTIDAD ?? 1}
                    </td>
                    <td className="px-4 py-3">
                      <EstadoBadge estado={activo.ESTADO_DISPLAY} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600 max-w-[150px] truncate" title={activo.OBSERVACIONES}>
                        {activo.OBSERVACIONES || <span className="text-gray-300">—</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onEdit(activo)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar activo"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => onToggleActivo(activo)}
                          className={`p-1.5 rounded-lg transition-colors ${activo.ACTIVO ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                          title={activo.ACTIVO ? 'Desactivar' : 'Activar'}
                        >
                          {activo.ACTIVO ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => onDelete(activo)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar activo"
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

export default ActivosTable;
