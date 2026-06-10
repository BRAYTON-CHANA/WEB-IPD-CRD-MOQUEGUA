import React from 'react';
import logo     from '@/../../public/logo.png';
import selloCRD from '@/../../public/crdMoquegua.png';

export const FIRMAS = [
  { nombre: 'Nombre Firma 1', cargo: 'Cargo 1' },
  { nombre: 'Nombre Firma 2', cargo: 'Cargo 2' },
];

/* ── Átomos ────────────────────────────────────────────────────── */

export const TicketHeader = () => (
  <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
    <img src={logo}     alt="IPD Logo"     className="h-10 w-auto object-contain" />
    <span className="text-base font-bold text-gray-700 tracking-widest">I.P.D</span>
    <img src={selloCRD} alt="CRD Moquegua" className="h-12 w-12 object-contain" />
  </div>
);

export const TicketFooter = () => (
  <div className="mt-3 pt-2 border-t border-gray-200 text-center">
    <span className="text-[10px] text-gray-400 tracking-widest uppercase">CRD Moquegua</span>
  </div>
);

export const DataRow = ({ label, value }) => {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="mb-1.5">
      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium leading-snug">{String(value)}</p>
    </div>
  );
};

/* ── FRENTE ────────────────────────────────────────────────────── */

export const TicketFrente = ({ reserva, compact = false }) => {
  const tipo = reserva.ORGANIZADOR_TIPO;
  const p = compact ? 'p-3' : 'p-5';
  return (
    <div className={`bg-white border border-gray-200 ${p} w-full flex flex-col ticket-face ticket-frente`}>
      <TicketHeader />
      <p className="text-center text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
        Permiso de Uso
      </p>
      <div className="flex-1 space-y-0.5">
        <DataRow label="Nombres y Apellidos" value={reserva.ORGANIZADOR_NOMBRE} />
        {tipo === 'Externo' && (
          <>
            <div className="grid grid-cols-2 gap-x-3">
              <DataRow label="DNI / RUC"     value={reserva.EXTERNO_DNI_RUC} />
              <DataRow label="Menor de Edad" value={reserva.EXTERNO_ES_MENOR ? 'Sí' : 'No'} />
            </div>
            <DataRow label="Domicilio" value={reserva.EXTERNO_DOMICILIO} />
            <div className="grid grid-cols-2 gap-x-3">
              <DataRow label="Email"    value={reserva.EXTERNO_EMAIL}    />
              <DataRow label="Teléfono" value={reserva.EXTERNO_TELEFONO} />
            </div>
          </>
        )}
        {tipo === 'Empleado' && <DataRow label="Tipo" value="Empleado IPD" />}
        {tipo === 'Oficina'  && <DataRow label="Tipo" value="Oficina IPD"  />}
        <div className="grid grid-cols-2 gap-x-3 pt-1">
          <DataRow label="Programa" value={reserva.PROGRAMA_NOMBRE || 'Sin programa'} />
          <DataRow
            label="Espacio y Sede"
            value={[reserva.ESPACIO_NOMBRE, reserva.INFRAESTRUCTURA_NOMBRE].filter(Boolean).join(' — ')}
          />
        </div>
      </div>
      <TicketFooter />
    </div>
  );
};

/* ── REVERSO ───────────────────────────────────────────────────── */

const formatFecha = (fecha) => {
  if (!fecha) return '';
  const d = new Date(fecha + 'T00:00:00');
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: '2-digit' });
};

const formatHora = (hora) => (hora ? hora.slice(0, 5) : '');

export const TicketReverso = ({ reserva, compact = false }) => {
  const horariosActivos = (reserva.HORARIOS_JSON || []).filter(h => h.activo !== false);
  const p = compact ? 'p-3' : 'p-5';
  return (
    <div className={`bg-white border border-gray-200 ${p} w-full flex flex-col ticket-face ticket-reverso`}>
      <TicketHeader />
      <p className="text-center text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
        Horarios Autorizados
      </p>
      <div className="flex-1">
        {horariosActivos.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-4">Sin horarios registrados</p>
        ) : (
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${Math.min(horariosActivos.length, 4)}, 1fr)` }}
          >
            {horariosActivos.map((h, i) => (
              <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5">
                <p className="text-[10px] text-blue-500 font-semibold mb-0.5">{formatFecha(h.fecha)}</p>
                <p className="font-mono text-xs font-bold text-gray-800">
                  {formatHora(h.hora_inicio)}
                  <span className="text-blue-400 mx-1">→</span>
                  {formatHora(h.hora_fin)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-8 mt-4 pt-3 border-t border-gray-100">
        {FIRMAS.map((f, i) => (
          <div key={i} className="text-center">
            <div className="h-10 border-b-2 border-dashed border-gray-300 mb-1.5" />
            <p className="text-[11px] font-semibold text-gray-700 leading-tight">{f.nombre}</p>
            <p className="text-[9px] text-gray-400 mt-0.5">{f.cargo}</p>
          </div>
        ))}
      </div>
      <TicketFooter />
    </div>
  );
};
