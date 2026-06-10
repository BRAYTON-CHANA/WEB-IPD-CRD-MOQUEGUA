import React from 'react';

const WarnIcon = () => (
  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
  </svg>
);

const ToggleActivoModal = ({ modal, onConfirm, onCancel }) => {
  if (!modal) return null;

  const { reserva, conflictos } = modal;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          {conflictos ? (
            <>
              <div className="flex items-start gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <WarnIcon />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-800 leading-snug">
                    Cruces al activar{conflictos.espacio_nombre ? ` "${conflictos.espacio_nombre}"` : ''}
                  </h3>
                  {conflictos.infraestructura_nombre && (
                    <p className="text-xs text-gray-400 mt-0.5">{conflictos.infraestructura_nombre}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {conflictos.items.length} cruce(s) con reservas activas
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-5 mt-4 max-h-48 overflow-y-auto">
                {conflictos.items.map((c, i) => (
                  <div key={i} className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                    <p className="font-medium text-gray-800">{c.organizador_nombre}</p>
                    <p className="text-gray-500">
                      Reserva #{c.id_reserva} · {c.fecha} · {c.hora_inicio?.slice(0, 5)}–{c.hora_fin?.slice(0, 5)}
                    </p>
                    {(conflictos.espacio_nombre || conflictos.infraestructura_nombre) && (
                      <p className="text-xs text-amber-700 mt-0.5">
                        {[conflictos.espacio_nombre, conflictos.infraestructura_nombre].filter(Boolean).join(' — ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mb-6">
              <p className="text-gray-700 font-medium">
                {reserva.ACTIVO ? '¿Desactivar esta reserva?' : '¿Activar esta reserva?'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Reserva #{reserva.ID_RESERVA} · {reserva.ESPACIO_NOMBRE}
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${
                conflictos
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : reserva.ACTIVO
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {conflictos
                ? 'Activar de todas formas'
                : reserva.ACTIVO ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleActivoModal;
