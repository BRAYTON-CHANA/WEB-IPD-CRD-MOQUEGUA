import React, { useState, useEffect, useRef } from 'react';

const ESTADO_COLORS = {
  'Próximo':      'bg-yellow-100 text-yellow-800',
  'En proceso':   'bg-blue-100 text-blue-800',
  'Terminado':    'bg-gray-100 text-gray-600',
  'Inactivo':     'bg-red-100 text-red-700',
  'Sin horarios': 'bg-gray-100 text-gray-400',
};

const TIPO_COLORS = {
  'Externo':  'bg-purple-100 text-purple-700',
  'Oficina':  'bg-blue-100 text-blue-700',
  'Empleado': 'bg-orange-100 text-orange-700',
};

const formatFechaCorta = (fecha) => {
  if (!fecha) return '—';
  const d = new Date(fecha + 'T00:00:00');
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
};

const ActionsMenu = ({ reserva, onVerHorarios, onVerTicket }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        title="Acciones"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 text-sm">
          <button
            onClick={() => { onVerHorarios(reserva); setOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ver Horarios
          </button>
          <button
            onClick={() => { onVerTicket(reserva); setOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Ver Ticket
          </button>
        </div>
      )}
    </div>
  );
};

const ReservaRow = ({ reserva, onEdit, onDelete, onToggle, onVerHorarios, onVerTicket, toggleLoading, seleccionada, onToggleSeleccion }) => (
  <tr className={`hover:bg-gray-50 ${seleccionada ? 'bg-blue-50' : ''}`}>
    <td className="px-3 py-4 whitespace-nowrap">
      <input
        type="checkbox"
        checked={seleccionada}
        onChange={() => onToggleSeleccion(reserva.ID_RESERVA)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
      #{reserva.ID_RESERVA}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
      {reserva.ESPACIO_NOMBRE || '—'}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          TIPO_COLORS[reserva.ORGANIZADOR_TIPO] || 'bg-gray-100 text-gray-600'
        }`}>
          {reserva.ORGANIZADOR_TIPO}
        </span>
        <span className="text-gray-800">{reserva.ORGANIZADOR_NOMBRE || '—'}</span>
      </div>
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
      {reserva.PROGRAMA_NOMBRE || <span className="text-gray-400 italic">Sin programa</span>}
    </td>
    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
      {reserva.FECHA_INICIO ? (
        <div className="leading-tight">
          <p>{formatFechaCorta(reserva.FECHA_INICIO)}</p>
          {reserva.FECHA_FIN && reserva.FECHA_FIN !== reserva.FECHA_INICIO && (
            <p className="text-gray-400">→ {formatFechaCorta(reserva.FECHA_FIN)}</p>
          )}
        </div>
      ) : <span className="text-gray-300">—</span>}
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        ESTADO_COLORS[reserva.ESTADO_RESERVA] || 'bg-gray-100 text-gray-600'
      }`}>
        {reserva.ESTADO_RESERVA}
      </span>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <button
        onClick={() => onToggle(reserva)}
        disabled={toggleLoading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          reserva.ACTIVO ? 'bg-green-500' : 'bg-gray-300'
        } disabled:opacity-50`}
        title={reserva.ACTIVO ? 'Desactivar reserva' : 'Activar reserva'}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          reserva.ACTIVO ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </td>
    <td className="px-4 py-4 whitespace-nowrap">
      <div className="flex items-center gap-1 justify-end">
        <ActionsMenu
          reserva={reserva}
          onVerHorarios={onVerHorarios}
          onVerTicket={onVerTicket}
        />
        <button
          onClick={() => onEdit(reserva)}
          className="p-1.5 rounded-md text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition"
          title="Editar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(reserva.ID_RESERVA)}
          className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition"
          title="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
);

const ReservasTable = ({ reservas, onEdit, onDelete, onToggle, onVerHorarios, onVerTicket, toggleLoading, seleccionadas = new Set(), onToggleSeleccion, onToggleTodas }) => {
  const todasSeleccionadas = reservas.length > 0 && reservas.every(r => seleccionadas.has(r.ID_RESERVA));
  const algunaSeleccionada = reservas.some(r => seleccionadas.has(r.ID_RESERVA));

  return (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-3 py-3 w-10">
            <input
              type="checkbox"
              checked={todasSeleccionadas}
              ref={el => { if (el) el.indeterminate = algunaSeleccionada && !todasSeleccionadas; }}
              onChange={onToggleTodas}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              title="Seleccionar todas"
            />
          </th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Espacio</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organizador</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programa</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fechas</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo</th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {reservas.map((reserva) => (
          <ReservaRow
            key={reserva.ID_RESERVA}
            reserva={reserva}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
            onVerHorarios={onVerHorarios}
            onVerTicket={onVerTicket}
            toggleLoading={toggleLoading}
            seleccionada={seleccionadas.has(reserva.ID_RESERVA)}
            onToggleSeleccion={onToggleSeleccion}
          />
        ))}
        {reservas.length === 0 && (
          <tr>
            <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
              No hay reservas que coincidan con los filtros
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  );
};

export default ReservasTable;
