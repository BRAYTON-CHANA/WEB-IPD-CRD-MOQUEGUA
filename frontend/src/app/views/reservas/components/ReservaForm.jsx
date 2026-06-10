import React, { useState, useEffect, useRef } from 'react';
import ExternosCrud from '@/entities/externos/ExternosCrud';
import { useReservaForm } from './ReservaForm/hooks/useReservaForm';
import SolicitantePage from './ReservaForm/pages/SolicitantePage';
import HorariosPage from './ReservaForm/pages/HorariosPage';

/**
 * ReservaForm - Componente orquestador
 * Usa el hook useReservaForm para lógica y componentes modulares para UI
 */
const ReservaForm = ({ initialData = null, onSuccess, onCancel }) => {
  const {
    formData, horarios, solicitanteData, modoExterno, nuevoExternoData,
    loading, error, conflictos, setConflictos, currentPage, isEdit,
    setCurrentPage, handleChange, handleHorarioChange,
    agregarHorario, eliminarHorario,
    handleNuevoExterno, handleNuevoExternoChange, handleCancelarNuevoExterno,
    handleSubmit, getSolicitanteValido
  } = useReservaForm(initialData, onSuccess);

  const [showExternoModal, setShowExternoModal] = useState(false);
  const errorRef = useRef(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [error]);

  const handleExternoCreated = (data) => {
    handleChange('id_externo', data.ID_EXTERNO);
    setShowExternoModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex-1 h-2 rounded ${currentPage === 1 ? 'bg-blue-500' : 'bg-blue-200'}`} />
        <div className={`flex-1 h-2 rounded ${currentPage === 2 ? 'bg-blue-500' : 'bg-gray-200'}`} />
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {currentPage === 1 ? 'Paso 1: Solicitante' : 'Paso 2: Horarios'}
        </h2>
        <span className="text-sm text-gray-500">{currentPage}/2</span>
      </div>

      {/* Error */}
      {error && (
        <div ref={errorRef} className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Page Content */}
      {currentPage === 1 ? (
        <SolicitantePage
          formData={formData}
          solicitanteData={solicitanteData}
          modoExterno={modoExterno}
          nuevoExternoData={nuevoExternoData}
          onChange={handleChange}
          onNuevoExterno={handleNuevoExterno}
          onCancelarNuevoExterno={handleCancelarNuevoExterno}
          onNuevoExternoChange={handleNuevoExternoChange}
        />
      ) : (
        <HorariosPage
          formData={formData}
          horarios={horarios}
          onChange={handleChange}
          onHorarioChange={handleHorarioChange}
          onAddHorario={agregarHorario}
          onRemoveHorario={eliminarHorario}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <div>
          {currentPage === 2 && (
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              disabled={loading}
            >
              ← Atrás
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            disabled={loading}
          >
            Cancelar
          </button>

          {currentPage === 1 ? (
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              disabled={!getSolicitanteValido()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Reserva')}
            </button>
          )}
        </div>
      </div>

      {/* Modal: Conflictos de horario */}
      {conflictos && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-start gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-800 leading-snug">
                    Cruces al reservar{conflictos.espacio_nombre ? ` “${conflictos.espacio_nombre}”` : ''}
                  </h3>
                  {conflictos.infraestructura_nombre && (
                    <p className="text-xs text-gray-400 mt-0.5">{conflictos.infraestructura_nombre}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {conflictos.items.length} cruce(s) detectado(s) con otras reservas activas
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-5 mt-4 max-h-52 overflow-y-auto">
                {conflictos.items.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-amber-500 mt-0.5">⚠️</span>
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">{c.organizador_nombre}</p>
                      <p className="text-gray-500">
                        Reserva #{c.id_reserva} · {c.fecha} · {c.hora_inicio?.slice(0,5)}–{c.hora_fin?.slice(0,5)}
                      </p>
                      {(conflictos.espacio_nombre || conflictos.infraestructura_nombre) && (
                        <p className="text-xs text-amber-700 mt-0.5">
                          {[conflictos.espacio_nombre, conflictos.infraestructura_nombre].filter(Boolean).join(' — ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setConflictos(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => { setConflictos(null); handleSubmit(null, true); }}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium"
                >
                  Guardar de todas formas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal ExternosCrud */}
      {showExternoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Crear Nuevo Externo</h3>
                <button
                  onClick={() => setShowExternoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <ExternosCrud
                config={{
                  headerProps: {
                    createButtonText: 'Guardar y Seleccionar',
                    extraActions: [{
                      text: 'Cancelar',
                      onClick: () => setShowExternoModal(false),
                      font: 'bg-gray-500 hover:bg-gray-600 text-white'
                    }]
                  }
                }}
                onRecordCreated={handleExternoCreated}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaForm;
