import React from 'react';

const TIPOS = [
  { key: 'EXTERNO', label: 'Externo', emoji: '👤' },
  { key: 'EMPLEADO', label: 'Empleado', emoji: '👔' },
  { key: 'OFICINA', label: 'Oficina', emoji: '🏢' }
];

const TipoSelector = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Solicitante *</label>
    <div className="grid grid-cols-3 gap-3">
      {TIPOS.map(tipo => (
        <button
          key={tipo.key}
          type="button"
          onClick={() => onChange('tipo_solicitante', tipo.key)}
          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition ${
            value === tipo.key
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-600'
          }`}
        >
          {tipo.emoji} {tipo.label}
        </button>
      ))}
    </div>
  </div>
);

export default TipoSelector;
