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

const EmpleadoDisplay = ({ data }) => {
  if (!data) return null;

  const nombreCompleto = data.EMPLEADO_NOMBRE_COMPLETO ||
    `${data.EMPLEADO_APELLIDOS || ''} ${data.EMPLEADO_NOMBRES || ''}`.trim();

  const ubicacion = data.UBICACION ||
    `${data.INFRAESTRUCTURA || ''} — ${data.NOMBRE_OFICINA || ''}`;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-3">
        <DisplayField label="DNI" value={data.EMPLEADO_DNI} />
        <DisplayField label="Cargo" value={data.NOMBRE_CARGO} />
      </div>
      <DisplayField label="Nombre Completo" value={nombreCompleto} />
      <div className="grid grid-cols-2 gap-3">
        <DisplayField label="Email" value={data.EMPLEADO_EMAIL} />
        <DisplayField label="Teléfono" value={data.EMPLEADO_TELEFONO} />
      </div>
      <DisplayField label="Ubicación" value={ubicacion} />
    </div>
  );
};

export default EmpleadoDisplay;
