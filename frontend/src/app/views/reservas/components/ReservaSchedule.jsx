import React, { useState, useMemo, useRef, useEffect } from 'react';

/* ── Constantes ─────────────────────────────────────────────────── */

const ESTADO_COLORS = {
  'Próximo':      { bg: 'bg-blue-100',  text: 'text-blue-800',  border: 'border-blue-300',  dot: 'bg-blue-500'  },
  'En proceso':   { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', dot: 'bg-green-500' },
  'Terminado':    { bg: 'bg-gray-100',  text: 'text-gray-600',  border: 'border-gray-300',  dot: 'bg-gray-400'  },
  'Inactivo':     { bg: 'bg-red-100',   text: 'text-red-700',   border: 'border-red-300',   dot: 'bg-red-500'   },
  'Sin horarios': { bg: 'bg-gray-50',   text: 'text-gray-400',  border: 'border-gray-200',  dot: 'bg-gray-300'  },
};

const DIAS_SEMANA  = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const HORA_INICIO  = 6;
const HORA_FIN     = 22;
const HORAS        = Array.from({ length: HORA_FIN - HORA_INICIO }, (_, i) => HORA_INICIO + i);

/* ── Utilidades ─────────────────────────────────────────────────── */

const toMinutes = (hora) => {
  if (!hora) return 0;
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + (m || 0);
};

const fmtHora = (hora) => (hora ? hora.slice(0, 5) : '');

const isoDate = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const addDays = (dateStr, n) => {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

const weekStart = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
};

const today = () => new Date().toISOString().slice(0, 10);

/* ── Expandir horarios de todas las reservas ────────────────────── */

const expandirEventos = (reservas) => {
  const eventos = [];
  reservas.forEach(r => {
    if (!r.ACTIVO) return;
    const horarios = r.HORARIOS_JSON || [];
    horarios.forEach(h => {
      if (h.activo === false) return;
      if (!h.fecha) return;
      eventos.push({
        fecha:       h.fecha,
        hora_inicio: h.hora_inicio,
        hora_fin:    h.hora_fin,
        reserva:     r,
      });
    });
  });
  return eventos;
};

/* ── ReservaDetailModal ─────────────────────────────────────────── */

const ReservaDetailModal = ({ evento, onClose, onVerTicket, onEdit }) => {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  if (!evento) return null;
  const { reserva, fecha, hora_inicio, hora_fin } = evento;
  const color = ESTADO_COLORS[reserva.ESTADO_RESERVA] || ESTADO_COLORS['Sin horarios'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={ref} className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-4 border-b ${color.bg} ${color.border} border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
              <span className={`text-xs font-semibold uppercase tracking-wide ${color.text}`}>
                {reserva.ESTADO_RESERVA}
              </span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-lg font-bold text-gray-800">{reserva.ORGANIZADOR_NOMBRE || '—'}</p>
          <p className="text-sm text-gray-500">
            {new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            {' · '}
            <span className="font-medium">{fmtHora(hora_inicio)} – {fmtHora(hora_fin)}</span>
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Espacio</p>
              <p className="text-sm font-medium text-gray-800">{reserva.ESPACIO_NOMBRE || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sede</p>
              <p className="text-sm font-medium text-gray-800">{reserva.INFRAESTRUCTURA_NOMBRE || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tipo</p>
              <p className="text-sm font-medium text-gray-800">{reserva.ORGANIZADOR_TIPO || '—'}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Programa</p>
              <p className="text-sm font-medium text-gray-800">{reserva.PROGRAMA_NOMBRE || 'Sin programa'}</p>
            </div>
          </div>
          {reserva.NOTAS && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Notas</p>
              <p className="text-sm text-gray-600">{reserva.NOTAS}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Cerrar
          </button>
          <button
            onClick={() => { onEdit(reserva); onClose(); }}
            className="px-4 py-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
          >
            Editar
          </button>
          <button
            onClick={() => { onVerTicket(reserva); onClose(); }}
            className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Ver Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── EventoChip ─────────────────────────────────────────────────── */

const EventoChip = ({ evento, onClick, compact = false }) => {
  const color = ESTADO_COLORS[evento.reserva.ESTADO_RESERVA] || ESTADO_COLORS['Sin horarios'];
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(evento); }}
      className={`w-full text-left rounded px-1.5 py-0.5 text-[10px] font-medium truncate border ${color.bg} ${color.text} ${color.border} hover:opacity-80 transition`}
    >
      {compact
        ? `${fmtHora(evento.hora_inicio)} ${evento.reserva.ESPACIO_NOMBRE || ''}`
        : `${fmtHora(evento.hora_inicio)}–${fmtHora(evento.hora_fin)} ${evento.reserva.ESPACIO_NOMBRE || ''}`
      }
    </button>
  );
};

/* ── MonthView ──────────────────────────────────────────────────── */

const MonthView = ({ year, month, eventosPorFecha, onEventoClick }) => {
  const todayStr = today();

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const MAX_VISIBLE = 3;

  return (
    <div className="flex-1 overflow-auto">
      {/* Header días */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DIAS_SEMANA.map(d => (
          <div key={d} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Celdas */}
      <div className="grid grid-cols-7 flex-1">
        {cells.map((day, idx) => {
          const dateStr = day ? isoDate(year, month, day) : null;
          const eventos = dateStr ? (eventosPorFecha[dateStr] || []) : [];
          const isToday = dateStr === todayStr;
          const isWeekend = idx % 7 >= 5;

          return (
            <div
              key={idx}
              className={`min-h-[90px] border-b border-r border-gray-100 p-1.5 ${
                !day ? 'bg-gray-50' : isWeekend ? 'bg-orange-50/30' : 'bg-white'
              }`}
            >
              {day && (
                <>
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold mb-1 ${
                    isToday ? 'bg-blue-600 text-white' : 'text-gray-600'
                  }`}>
                    {day}
                  </span>
                  <div className="space-y-0.5">
                    {eventos.slice(0, MAX_VISIBLE).map((ev, i) => (
                      <EventoChip key={i} evento={ev} onClick={onEventoClick} compact />
                    ))}
                    {eventos.length > MAX_VISIBLE && (
                      <button
                        className="text-[10px] text-blue-500 font-medium hover:underline px-1"
                        onClick={() => onEventoClick(eventos[MAX_VISIBLE])}
                      >
                        +{eventos.length - MAX_VISIBLE} más
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── WeekView ───────────────────────────────────────────────────── */

const WeekView = ({ weekStartStr, eventosPorFecha, onEventoClick }) => {
  const todayStr = today();
  const dias = Array.from({ length: 7 }, (_, i) => addDays(weekStartStr, i));
  const totalMins = (HORA_FIN - HORA_INICIO) * 60;
  const PX_PER_MIN = 1.5;
  const totalHeight = totalMins * PX_PER_MIN;

  return (
    <div className="flex-1 overflow-auto">
      {/* Header días */}
      <div className="grid grid-cols-[48px_repeat(7,1fr)] border-b border-gray-200 sticky top-0 bg-white z-10">
        <div />
        {dias.map((d, i) => {
          const date = new Date(d + 'T00:00:00');
          const isToday = d === todayStr;
          return (
            <div key={i} className={`py-2 text-center border-l border-gray-100 ${isToday ? 'bg-blue-50' : ''}`}>
              <p className="text-[10px] font-semibold text-gray-500 uppercase">{DIAS_SEMANA[i]}</p>
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mt-0.5 ${
                isToday ? 'bg-blue-600 text-white' : 'text-gray-700'
              }`}>
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Grid de horas */}
      <div className="grid grid-cols-[48px_repeat(7,1fr)]">
        {/* Columna de horas */}
        <div style={{ height: totalHeight }}>
          {HORAS.map(h => (
            <div
              key={h}
              style={{ height: 60 * PX_PER_MIN }}
              className="flex items-start pt-0.5 justify-end pr-2 text-[10px] text-gray-400 font-medium border-b border-gray-50"
            >
              {String(h).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Columnas de días */}
        {dias.map((d, di) => {
          const eventos = eventosPorFecha[d] || [];
          const isToday = d === todayStr;
          return (
            <div
              key={di}
              className={`relative border-l border-gray-100 ${isToday ? 'bg-blue-50/30' : ''}`}
              style={{ height: totalHeight }}
            >
              {/* Líneas de horas */}
              {HORAS.map(h => (
                <div
                  key={h}
                  style={{ top: (h - HORA_INICIO) * 60 * PX_PER_MIN }}
                  className="absolute w-full border-t border-gray-100"
                />
              ))}

              {/* Eventos */}
              {eventos.map((ev, ei) => {
                const startMin = toMinutes(ev.hora_inicio) - HORA_INICIO * 60;
                const endMin   = toMinutes(ev.hora_fin)   - HORA_INICIO * 60;
                const top      = Math.max(0, startMin) * PX_PER_MIN;
                const height   = Math.max(20, (endMin - startMin)) * PX_PER_MIN;
                const color    = ESTADO_COLORS[ev.reserva.ESTADO_RESERVA] || ESTADO_COLORS['Sin horarios'];

                return (
                  <button
                    key={ei}
                    onClick={(e) => { e.stopPropagation(); onEventoClick(ev); }}
                    style={{ top, height, left: 2, right: 2 }}
                    className={`absolute rounded px-1.5 py-0.5 text-[9px] font-semibold text-left leading-tight overflow-hidden border ${color.bg} ${color.text} ${color.border} hover:opacity-80 transition z-10`}
                  >
                    <p className="truncate">{ev.reserva.ESPACIO_NOMBRE || '—'}</p>
                    <p className="truncate opacity-80">{fmtHora(ev.hora_inicio)}–{fmtHora(ev.hora_fin)}</p>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ── CalendarHeader ─────────────────────────────────────────────── */

const CalendarHeader = ({ vistaMode, setVistaMode, year, month, weekStartStr, onPrev, onNext, onHoy }) => {
  const titulo = vistaMode === 'month'
    ? `${MESES[month]} ${year}`
    : (() => {
        const start = new Date(weekStartStr + 'T00:00:00');
        const end   = new Date(weekStartStr + 'T00:00:00');
        end.setDate(end.getDate() + 6);
        const fmt = (d) => d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
        return `${fmt(start)} – ${fmt(end)}, ${start.getFullYear()}`;
      })();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h2 className="text-base font-semibold text-gray-800 min-w-[200px]">{titulo}</h2>
        <button
          onClick={onHoy}
          className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          Hoy
        </button>
      </div>

      {/* Toggle vista */}
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        <button
          onClick={() => setVistaMode('month')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            vistaMode === 'month' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mes
        </button>
        <button
          onClick={() => setVistaMode('week')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
            vistaMode === 'week' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Semana
        </button>
      </div>
    </div>
  );
};

/* ── ReservaSchedule (principal) ────────────────────────────────── */

const ReservaSchedule = ({ reservas = [], onVerTicket, onEdit }) => {
  const todayStr = today();
  const [vistaMode, setVistaMode]   = useState('month');
  const [currentDate, setCurrentDate] = useState(todayStr);
  const [modalEvento, setModalEvento] = useState(null);

  const curDate  = new Date(currentDate + 'T00:00:00');
  const year     = curDate.getFullYear();
  const month    = curDate.getMonth();
  const wkStart  = weekStart(currentDate);

  const eventos = useMemo(() => expandirEventos(reservas), [reservas]);

  const eventosPorFecha = useMemo(() => {
    const map = {};
    eventos.forEach(ev => {
      if (!map[ev.fecha]) map[ev.fecha] = [];
      map[ev.fecha].push(ev);
    });
    Object.values(map).forEach(arr =>
      arr.sort((a, b) => toMinutes(a.hora_inicio) - toMinutes(b.hora_inicio))
    );
    return map;
  }, [eventos]);

  const handlePrev = () => {
    if (vistaMode === 'month') {
      const d = new Date(year, month - 1, 1);
      setCurrentDate(isoDate(d.getFullYear(), d.getMonth(), 1));
    } else {
      setCurrentDate(addDays(wkStart, -7));
    }
  };

  const handleNext = () => {
    if (vistaMode === 'month') {
      const d = new Date(year, month + 1, 1);
      setCurrentDate(isoDate(d.getFullYear(), d.getMonth(), 1));
    } else {
      setCurrentDate(addDays(wkStart, 7));
    }
  };

  const handleHoy = () => setCurrentDate(todayStr);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow border border-gray-200 overflow-hidden" style={{ minHeight: '600px' }}>
      <CalendarHeader
        vistaMode={vistaMode}
        setVistaMode={setVistaMode}
        year={year}
        month={month}
        weekStartStr={wkStart}
        onPrev={handlePrev}
        onNext={handleNext}
        onHoy={handleHoy}
      />

      {vistaMode === 'month' ? (
        <MonthView
          year={year}
          month={month}
          eventosPorFecha={eventosPorFecha}
          onEventoClick={setModalEvento}
        />
      ) : (
        <WeekView
          weekStartStr={wkStart}
          eventosPorFecha={eventosPorFecha}
          onEventoClick={setModalEvento}
        />
      )}

      {modalEvento && (
        <ReservaDetailModal
          evento={modalEvento}
          onClose={() => setModalEvento(null)}
          onVerTicket={onVerTicket}
          onEdit={onEdit}
        />
      )}
    </div>
  );
};

export default ReservaSchedule;
