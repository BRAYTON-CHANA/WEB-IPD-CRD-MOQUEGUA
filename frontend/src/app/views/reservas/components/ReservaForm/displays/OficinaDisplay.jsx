import React from 'react';

const DisplayField = ({ label, value }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      value={value || ''}
      disabled
      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600"
    />
  </div>
);

const OficinaDisplay = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-2">
      <DisplayField label="Oficina" value={data.NOMBRE_OFICINA} />
      <div className="grid grid-cols-2 gap-3">
        <DisplayField label="Piso / Nivel" value={data.PISO_NIVEL} />
        <DisplayField label="Infraestructura" value={data.INFRAESTRUCTURA || data.NOMBRE} />
      </div>
      <DisplayField label="Teléfono de Infraestructura" value={data.TELEFONO_CONTACTO} />
    </div>
  );
};

export default OficinaDisplay;
