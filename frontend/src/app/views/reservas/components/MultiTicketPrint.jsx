import React from 'react';
import { TicketFrente, TicketReverso } from './TicketPartes';

/* ── MultiTicketPrint ──────────────────────────────────────────────
   Recibe un array de reservas y las imprime:
   - Página 1: grid 2×3 de frentes
   - Página 2: grid 2×3 de reversos
   Si hay más de 6, se generan páginas adicionales automáticamente.
──────────────────────────────────────────────────────────────────── */

const TICKETS_POR_PAGINA = 8;

const agrupar = (arr, size) => {
  const grupos = [];
  for (let i = 0; i < arr.length; i += size) grupos.push(arr.slice(i, i + size));
  return grupos;
};

const MultiTicketPrint = ({ reservas = [], onBack }) => {
  const grupos = agrupar(reservas, TICKETS_POR_PAGINA);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de acciones — oculta al imprimir */}
      <div className="no-print flex items-center gap-4 p-6 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Reservas
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir / PDF ({reservas.length} ticket{reservas.length !== 1 ? 's' : ''})
        </button>
      </div>

      {/* Vista pantalla: lista resumen */}
      <div className="no-print px-6 pb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            {reservas.length} ticket{reservas.length !== 1 ? 's' : ''} seleccionado{reservas.length !== 1 ? 's' : ''} para imprimir
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {reservas.map((r, i) => (
              <div key={r.ID_RESERVA} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs font-bold text-blue-600 w-5">{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{r.ORGANIZADOR_NOMBRE || '—'}</p>
                  <p className="text-[10px] text-gray-400 truncate">{r.ESPACIO_NOMBRE || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview en pantalla: grid 2 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservas.map(r => (
            <div key={r.ID_RESERVA} className="shadow-md rounded-xl overflow-hidden">
              <TicketFrente reserva={r} />
            </div>
          ))}
        </div>
      </div>

      {/* Contenedor de impresión */}
      <div className="print-only">
        {grupos.map((grupo, gi) => (
          <React.Fragment key={gi}>
            {/* Página de frentes */}
            <div className="print-page print-grid">
              {grupo.map(r => (
                <TicketFrente key={r.ID_RESERVA} reserva={r} compact />
              ))}
            </div>
            {/* Página de reversos */}
            <div className="print-page print-grid">
              {grupo.map(r => (
                <TicketReverso key={r.ID_RESERVA} reserva={r} compact />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Print styles */}
      <style>{`
        .print-only { display: none; }

        @media print {
          @page { size: A4 portrait; margin: 8mm; }

          body * { visibility: hidden; }
          .print-only, .print-only * { visibility: visible; }
          .no-print { display: none !important; }
          body { background: white; margin: 0; }

          .print-only {
            display: block !important;
            position: absolute;
            top: 0; left: 0;
            width: 100%;
          }

          .print-page {
            page-break-after: always;
            width: 100%;
          }

          .print-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: repeat(4, 67mm);
            gap: 4mm;
          }

          .ticket-face {
            box-shadow: none !important;
            border: 1px solid #d1d5db !important;
            border-radius: 4px !important;
            padding: 3mm !important;
            font-size: 6.5pt !important;
            width: 95mm !important;
            max-width: 95mm !important;
            height: 67mm !important;
            max-height: 67mm !important;
            overflow: hidden !important;
            break-inside: avoid;
            box-sizing: border-box !important;
          }

          .ticket-face * {
            font-size: inherit;
          }

          .ticket-face img { max-height: 14px !important; }

          .ticket-face .text-sm   { font-size: 6.5pt !important; }
          .ticket-face .text-xs   { font-size: 5.5pt !important; }
          .ticket-face .text-base { font-size: 7pt   !important; }
          .ticket-face .text-\[10px\] { font-size: 5pt !important; }
          .ticket-face .text-\[9px\]  { font-size: 5pt !important; }
          .ticket-face .text-\[11px\] { font-size: 5.5pt !important; }
          .ticket-face .mb-3 { margin-bottom: 1mm !important; }
          .ticket-face .mb-1\.5 { margin-bottom: 0.5mm !important; }
          .ticket-face .pb-3 { padding-bottom: 1mm !important; }
          .ticket-face .mt-3 { margin-top: 1mm !important; }
          .ticket-face .mt-4 { margin-top: 1.5mm !important; }
          .ticket-face .h-10 { height: 6mm !important; }
          .ticket-face .gap-8 { gap: 3mm !important; }
          .ticket-face .py-1\.5 { padding-top: 0.5mm !important; padding-bottom: 0.5mm !important; }
        }
      `}</style>
    </div>
  );
};

export default MultiTicketPrint;
