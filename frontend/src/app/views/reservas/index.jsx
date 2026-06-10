import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/shared/components/layout/Layout';
import { db } from '@/shared/api';
import ReservaForm from './components/ReservaForm';
import ReservasTable from './components/ReservasTable';
import ToggleActivoModal from './components/ToggleActivoModal';
import HorariosModal from './components/HorariosModal';
import ReservaTicket from './components/ReservaTicket';
import MultiTicketPrint from './components/MultiTicketPrint';
import ReservaSchedule from './components/ReservaSchedule';

const COLUMNS = [
  'ID_RESERVA', 'ID_ESPACIO_DEPORTIVO', 'ID_PROGRAMA',
  'ID_EXTERNO', 'ID_OFICINA', 'ID_EMPLEADO_RESPONSABLE',
  'ESTADO_RESERVA', 'NOTAS', 'ACTIVO',
  'ESPACIO_NOMBRE', 'INFRAESTRUCTURA_NOMBRE', 'PROGRAMA_NOMBRE',
  'ORGANIZADOR_TIPO', 'ORGANIZADOR_NOMBRE',
  'EXTERNO_DNI_RUC', 'EXTERNO_DOMICILIO', 'EXTERNO_EMAIL',
  'EXTERNO_TELEFONO', 'EXTERNO_ES_MENOR',
  'HORARIOS_JSON', 'HORARIOS_RESUMEN',
  'FECHA_INICIO', 'FECHA_FIN',
];

function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'form' | 'ticket' | 'multi' | 'schedule'
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [horariosModal, setHorariosModal] = useState(null);
  const [toggleModal, setToggleModal] = useState(null); // { reserva, conflictos }
  const [toggleLoading, setToggleLoading] = useState(false);
  const [ticketReserva, setTicketReserva] = useState(null);
  const [seleccionadas, setSeleccionadas] = useState(new Set());
  const [filtros, setFiltros] = useState({ busqueda: '', tipo: '', estado: '', fechaDesde: '', fechaHasta: '' });

  const loadReservas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await db.select('vw_reservas_con_horarios', {}, COLUMNS);
      setReservas(result || []);
    } catch (err) {
      setError('Error al cargar reservas: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReservas(); }, [loadReservas]);

  const handleCreate = () => { setSelectedReserva(null); setView('form'); };
  const handleEdit   = (r)  => { setSelectedReserva(r);    setView('form'); };
  const handleBack   = ()   => { setSelectedReserva(null); setView('list'); };

  const handleDelete = async (id) => {
    if (!confirm('¿Está seguro de eliminar esta reserva?')) return;
    try {
      await db.executeFunction('sp_eliminar_reserva_con_horarios', { p_id_reserva: id });
      loadReservas();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleSaveSuccess = async (result) => {
    const payload = Array.isArray(result) ? result[0] : result;
    const idReserva = payload?.id_reserva;
    await loadReservas();
    setSelectedReserva(null);
    if (idReserva) {
      const lista = await db.select('vw_reservas_con_horarios', { ID_RESERVA: idReserva }, COLUMNS);
      const reservaCompleta = Array.isArray(lista) ? lista[0] : lista;
      setTicketReserva(reservaCompleta || null);
      setView('ticket');
    } else {
      setView('list');
    }
  };

  const handleVerTicket = (reserva) => {
    setTicketReserva(reserva);
    setView('ticket');
  };

  const handleBackFromTicket = () => {
    setTicketReserva(null);
    setView('list');
  };

  const toggleSeleccion = (id) => {
    setSeleccionadas(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleTodas = () => {
    const idsFiltrados = reservasFiltradas.map(r => r.ID_RESERVA);
    const todasMarcadas = idsFiltrados.every(id => seleccionadas.has(id));
    setSeleccionadas(prev => {
      const next = new Set(prev);
      if (todasMarcadas) idsFiltrados.forEach(id => next.delete(id));
      else idsFiltrados.forEach(id => next.add(id));
      return next;
    });
  };

  const imprimirSeleccionadas = () => {
    setView('multi');
  };

  const setFiltro = (key, val) => setFiltros(f => ({ ...f, [key]: val }));
  const limpiarFiltros = () => setFiltros({ busqueda: '', tipo: '', estado: '', fechaDesde: '', fechaHasta: '' });

  const reservasFiltradas = reservas.filter(r => {
    const txt = filtros.busqueda.toLowerCase();
    if (txt && ![
      r.ORGANIZADOR_NOMBRE, r.ESPACIO_NOMBRE, r.PROGRAMA_NOMBRE, r.INFRAESTRUCTURA_NOMBRE
    ].some(v => v && v.toLowerCase().includes(txt))) return false;
    if (filtros.tipo   && r.ORGANIZADOR_TIPO  !== filtros.tipo)   return false;
    if (filtros.estado && r.ESTADO_RESERVA    !== filtros.estado) return false;
    if (filtros.fechaDesde && r.FECHA_FIN   && r.FECHA_FIN   < filtros.fechaDesde) return false;
    if (filtros.fechaHasta && r.FECHA_INICIO && r.FECHA_INICIO > filtros.fechaHasta) return false;
    return true;
  });

  const handleToggleActivo = useCallback(async (reserva) => {
    if (reserva.ACTIVO) { setToggleModal({ reserva, conflictos: null }); return; }
    setToggleLoading(true);
    try {
      const horariosActivos = (reserva.HORARIOS_JSON || []).filter(h => h.activo);
      const checkResult = await db.executeFunction('fn_verificar_conflictos_horario', {
        p_id_espacio: reserva.ID_ESPACIO_DEPORTIVO,
        p_horarios:   horariosActivos,
        p_id_reserva: reserva.ID_RESERVA,
      });
      const p = Array.isArray(checkResult) ? checkResult[0] : checkResult;
      setToggleModal({
        reserva,
        conflictos: p?.tiene_conflictos
          ? { espacio_nombre: p.espacio_nombre || '', infraestructura_nombre: p.infraestructura_nombre || '', items: p.conflictos || [] }
          : null,
      });
    } catch (err) {
      alert('Error verificando conflictos: ' + err.message);
    } finally {
      setToggleLoading(false);
    }
  }, []);

  const confirmToggle = useCallback(async () => {
    if (!toggleModal) return;
    try {
      await db.executeFunction('sp_toggle_activo_reserva', { p_id_reserva: toggleModal.reserva.ID_RESERVA });
      setToggleModal(null);
      loadReservas();
    } catch (err) {
      alert('Error al cambiar estado: ' + err.message);
    }
  }, [toggleModal, loadReservas]);

  // ── Vista: Ticket individual ───────────────────────────────────────────
  if (view === 'ticket') {
    return (
      <Layout>
        <ReservaTicket reserva={ticketReserva} onBack={handleBackFromTicket} />
      </Layout>
    );
  }

  // ── Vista: Multi-ticket ────────────────────────────────────────────────
  if (view === 'multi') {
    const reservasSeleccionadas = reservas.filter(r => seleccionadas.has(r.ID_RESERVA));
    return (
      <Layout>
        <MultiTicketPrint
          reservas={reservasSeleccionadas}
          onBack={() => setView('list')}
        />
      </Layout>
    );
  }

  // ── Vista: Formulario ──────────────────────────────────────────────────
  if (view === 'form') {
    return (
      <Layout>
        <div className="p-8 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Atrás
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedReserva ? 'Editar Reserva' : 'Nueva Reserva'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {selectedReserva ? `Reserva #${selectedReserva.ID_RESERVA}` : 'Completa los datos para registrar la reserva'}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ReservaForm initialData={selectedReserva} onSuccess={handleSaveSuccess} onCancel={handleBack} />
          </div>
        </div>
      </Layout>
    );
  }

  // ── Vista: Lista ───────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Reservas</h1>
              <p className="text-gray-600 mt-1">Gestión de reservas y horarios</p>
            </div>
            {/* Toggle Lista / Calendario */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1 ml-4">
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  view === 'list' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Lista
              </button>
              <button
                onClick={() => setView('schedule')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  view === 'schedule' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendario
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {seleccionadas.size > 0 && (
              <button
                onClick={imprimirSeleccionadas}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Imprimir tickets ({seleccionadas.size})
              </button>
            )}
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva Reserva
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {/* Vista Calendario */}
        {view === 'schedule' && (
          loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : (
            <ReservaSchedule
              reservas={reservas}
              onVerTicket={handleVerTicket}
              onEdit={handleEdit}
            />
          )
        )}

        {/* Filtros + Tabla — solo en vista lista */}
        {view === 'list' && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
                  <input
                    type="text"
                    placeholder="Nombre, espacio, programa..."
                    value={filtros.busqueda}
                    onChange={e => setFiltro('busqueda', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="min-w-[130px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
                  <select
                    value={filtros.tipo}
                    onChange={e => setFiltro('tipo', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Todos</option>
                    <option value="Externo">Externo</option>
                    <option value="Oficina">Oficina</option>
                    <option value="Empleado">Empleado</option>
                  </select>
                </div>
                <div className="min-w-[140px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
                  <select
                    value={filtros.estado}
                    onChange={e => setFiltro('estado', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Todos</option>
                    <option value="Próximo">Próximo</option>
                    <option value="En proceso">En proceso</option>
                    <option value="Terminado">Terminado</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Sin horarios">Sin horarios</option>
                  </select>
                </div>
                <div className="min-w-[160px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fecha desde</label>
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="date"
                      value={filtros.fechaDesde}
                      onChange={e => setFiltro('fechaDesde', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 [color-scheme:light]"
                    />
                  </div>
                </div>
                <div className="min-w-[160px]">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Fecha hasta</label>
                  <div className="relative">
                    <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <input
                      type="date"
                      value={filtros.fechaHasta}
                      onChange={e => setFiltro('fechaHasta', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 [color-scheme:light]"
                    />
                  </div>
                </div>
                {Object.values(filtros).some(Boolean) && (
                  <button
                    onClick={limpiarFiltros}
                    className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              {Object.values(filtros).some(Boolean) && (
                <p className="text-xs text-gray-400 mt-2">
                  Mostrando {reservasFiltradas.length} de {reservas.length} reservas
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
              </div>
            ) : (
              <ReservasTable
                reservas={reservasFiltradas}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggleActivo}
                onVerHorarios={setHorariosModal}
                onVerTicket={handleVerTicket}
                toggleLoading={toggleLoading}
                seleccionadas={seleccionadas}
                onToggleSeleccion={toggleSeleccion}
                onToggleTodas={toggleTodas}
              />
            )}
          </>
        )}

        <ToggleActivoModal
          modal={toggleModal}
          onConfirm={confirmToggle}
          onCancel={() => setToggleModal(null)}
        />

        <HorariosModal
          reserva={horariosModal}
          onClose={() => setHorariosModal(null)}
        />
      </div>
    </Layout>
  );
}

export default ReservasPage;
