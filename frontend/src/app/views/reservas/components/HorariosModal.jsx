import React from 'react';

const HorariosModal = ({ reserva, onClose }) => {
  if (!reserva) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Horarios</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {reserva.ESPACIO_NOMBRE} · #{reserva.ID_RESERVA}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {(reserva.HORARIOS_JSON || []).length === 0 ? (
              <p className="text-gray-500 text-center py-4">Sin horarios registrados</p>
            ) : (
              (reserva.HORARIOS_JSON || []).map((h, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    h.activo ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-2xl">📅</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{h.fecha}</p>
                    <p className="text-sm text-gray-600">{h.hora_inicio} — {h.hora_fin}</p>
                  </div>
                  {!h.activo && <span className="text-xs text-gray-400 italic">Inactivo</span>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorariosModal;
