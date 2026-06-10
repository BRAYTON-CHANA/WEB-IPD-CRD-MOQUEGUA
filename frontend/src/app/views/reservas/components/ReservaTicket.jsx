import React from 'react';
import { TicketFrente, TicketReverso } from './TicketPartes';

/* ── Wrapper principal ─────────────────────────────────────────── */

const ReservaTicket = ({ reserva, onBack }) => {
  if (!reserva) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Botones — ocultos al imprimir */}
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
          Imprimir / PDF
        </button>
      </div>

      {/* Vista pantalla: lado a lado, igual altura */}
      <div className="no-print flex flex-col md:flex-row gap-6 justify-center items-stretch px-6 pb-10">
        <div className="flex-1 max-w-[520px] flex shadow-lg rounded-xl overflow-hidden">
          <TicketFrente reserva={reserva} />
        </div>
        <div className="flex-1 max-w-[520px] flex shadow-lg rounded-xl overflow-hidden">
          <TicketReverso reserva={reserva} />
        </div>
      </div>

      {/* Contenedor de impresión: frente pág 1, reverso pág 2 */}
      <div className="print-only">
        <div className="print-page">
          <TicketFrente reserva={reserva} />
        </div>
        <div className="print-page">
          <TicketReverso reserva={reserva} />
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        .print-only { display: none; }

        @media print {
          @page { size: A4 portrait; margin: 15mm; }

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
            display: flex;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
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

          .ticket-face * { font-size: inherit; }

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

export default ReservaTicket;
