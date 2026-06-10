import React, { useState } from 'react';
import ReferenceSelectInput from '@/shared/components/ui/inputs/ReferenceSelectInput';

// Validar que hora fin sea mayor que hora inicio
const validarHoras = (horaInicio, horaFin) => {
  if (!horaInicio || !horaFin) return true;
  return horaFin > horaInicio;
};

const HorarioRow = ({ horario, index, onChange, onRemove, horariosCount }) => {
  const [touched, setTouched] = useState({ fin: false });
  const esValido = validarHoras(horario.hora_inicio, horario.hora_fin);
  const mostrarError = touched.fin && !esValido && horario.hora_fin;

  const handleFinChange = (e) => {
    onChange(index, 'hora_fin', e.target.value);
    setTouched({ ...touched, fin: true });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
      {/* Header del horario */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Horario #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={horariosCount === 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar
        </button>
      </div>

      {/* Headers de columna */}
      <div className="grid grid-cols-12 gap-3 mb-2">
        <div className="col-span-5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
            📅 Día
          </label>
        </div>
        <div className="col-span-3">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
            🕐 Inicio
          </label>
        </div>
        <div className="col-span-3">
          <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
            🕐 Término
          </label>
        </div>
        <div className="col-span-1"></div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-12 gap-3 items-start">
        <div className="col-span-5">
          <input
            type="date"
            value={horario.fecha}
            onChange={(e) => onChange(index, 'fecha', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            style={{ colorScheme: 'light' }}
            required
          />
        </div>
        <div className="col-span-3">
          <input
            type="time"
            value={horario.hora_inicio}
            onChange={(e) => onChange(index, 'hora_inicio', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-center font-medium"
            style={{ colorScheme: 'light' }}
            required
          />
        </div>
        <div className="col-span-3">
          <input
            type="time"
            value={horario.hora_fin}
            onChange={handleFinChange}
            style={{ colorScheme: 'light' }}
            className={`w-full px-4 py-3 border rounded-lg text-base text-gray-800 focus:ring-2 transition text-center font-medium ${
              mostrarError
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50'
                : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
            }`}
            required
          />
          {mostrarError && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Debe ser mayor que inicio
            </p>
          )}
        </div>
        <div className="col-span-1 flex items-center justify-center h-full">
          <div className="h-px w-full bg-gray-300"></div>
        </div>
      </div>

      {/* Info de duración */}
      {horario.hora_inicio && horario.hora_fin && esValido && (
        <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">
            Duración: {(() => {
              const [h1, m1] = horario.hora_inicio.split(':').map(Number);
              const [h2, m2] = horario.hora_fin.split(':').map(Number);
              const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
              const h = Math.floor(minutos / 60);
              const m = minutos % 60;
              return `${h}h ${m}m`;
            })()}
          </span>
        </div>
      )}
    </div>
  );
};

const HorariosList = ({ horarios, onChange, onAdd, onRemove }) => (
  <div className="space-y-2">
    {/* Header de sección */}
    <div className="flex items-center justify-between py-2 border-b border-gray-200">
      <div>
        <h3 className="font-bold text-gray-800 text-lg">📅 Horarios de la Reserva</h3>
        <p className="text-sm text-gray-500 mt-0.5">Define los días y horarios de uso del espacio</p>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Agregar Horario
      </button>
    </div>

    {/* Lista de horarios */}
    <div className="pt-2">
      {horarios.map((h, i) => (
        <HorarioRow
          key={i}
          horario={h}
          index={i}
          onChange={onChange}
          onRemove={onRemove}
          horariosCount={horarios.length}
        />
      ))}
    </div>

    {/* Ayuda */}
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <p className="text-sm text-blue-700 flex items-start gap-2">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          <strong>Tip:</strong> La hora de término debe ser mayor que la de inicio. 
          Puedes agregar múltiples horarios para diferentes días.
        </span>
      </p>
    </div>
  </div>
);

const HorariosPage = ({
  formData,
  horarios,
  onChange,
  onHorarioChange,
  onAddHorario,
  onRemoveHorario
}) => (
  <div className="space-y-6">
    {/* Programa deportivo (opcional) */}
    <div>
      <ReferenceSelectInput
        name="id_programa"
        label="Programa Deportivo (opcional)"
        referenceTable="vw_programas_deportivos"
        referenceField="ID_PROGRAMA"
        referenceQuery="{PROGRAMA_NOMBRE} — {ESTADO_PROGRAMA}"
        value={formData.id_programa}
        onChange={onChange}
        formData={formData}
        searchable
      />
      <p className="text-xs text-gray-400 mt-1">
        Si esta reserva forma parte de un programa deportivo, selecciónalo aquí.
      </p>
    </div>

    <ReferenceSelectInput
      name="id_espacio_deportivo"
      label="Espacio Deportivo *"
      referenceTable="vw_espacios_por_infraestructura"
      referenceField="ID_ESPACIO_DEPORTIVO"
      referenceQuery="{INFRAESTRUCTURA} — {ESPACIO} (Cap: {CAPACIDAD})"
      value={formData.id_espacio_deportivo}
      onChange={onChange}
      formData={formData}
      searchable
      required
    />

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
      <textarea
        value={formData.notas}
        onChange={(e) => onChange('notas', e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        placeholder="Notas adicionales..."
      />
    </div>

    <HorariosList
      horarios={horarios}
      onChange={onHorarioChange}
      onAdd={onAddHorario}
      onRemove={onRemoveHorario}
    />
  </div>
);

export default HorariosPage;
