import React from 'react';

const DisplayField = ({ label, value }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      value={value || '—'}
      disabled
      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded text-sm text-gray-600"
    />
  </div>
);

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

const SectionTitle = ({ children }) => (
  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2 border-t border-gray-200 mt-1">
    {children}
  </p>
);

const ExternoDisplay = ({ data }) => {
  if (!data) return null;

  const isJuridica = data.ES_PERSONA_JURIDICA;
  const esMenor = data.ES_MENOR_DE_EDAD;

  return (
    <div className="space-y-3">
      {/* Identificación */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge color={isJuridica ? 'blue' : 'green'}>
          {isJuridica ? 'Organización' : 'Persona Natural'}
        </Badge>
        {esMenor && <Badge color="orange">Menor de Edad</Badge>}
        <Badge color={data.ACTIVO ? 'green' : 'red'}>
          {data.ACTIVO ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DisplayField label={isJuridica ? 'RUC' : 'DNI'} value={data.DNI_RUC} />
        <DisplayField
          label={isJuridica ? 'Razón Social' : 'Nombres'}
          value={`${data.NOMBRE_O_ORGANIZACION || ''} ${data.APELLIDO_O_TIPO_SOCIEDAD || ''}`.trim()}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <DisplayField label="Teléfono" value={data.TELEFONO_CONTACTO} />
        <DisplayField label="Correo" value={data.CORREO_CONTACTO} />
      </div>

      <DisplayField label="Domicilio / Ubicación" value={data.DOMICILIO_UBICACION} />

      {/* Tutor — solo menores */}
      {esMenor && (
        <>
          <SectionTitle>👨‍👩‍👧 Datos del Tutor</SectionTitle>
          <DisplayField label="Nombre del Tutor" value={data.TUTOR_NOMBRE_COMPLETO} />
          <div className="grid grid-cols-3 gap-3">
            <DisplayField label="DNI Tutor" value={data.TUTOR_DNI} />
            <DisplayField label="Teléfono Tutor" value={data.TUTOR_TELEFONO} />
            <DisplayField label="Parentesco" value={data.TUTOR_PARENTESCO} />
          </div>
        </>
      )}

      {/* Contacto de emergencia — persona natural */}
      {!isJuridica && (data.EMERGENCIA_NOMBRE || data.EMERGENCIA_TELEFONO) && (
        <>
          <SectionTitle>🚨 Contacto de Emergencia</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <DisplayField label="Nombre" value={data.EMERGENCIA_NOMBRE} />
            <DisplayField label="Teléfono" value={data.EMERGENCIA_TELEFONO} />
          </div>
        </>
      )}

      {/* Comentarios */}
      {data.COMENTARIOS && (
        <>
          <SectionTitle>Comentarios</SectionTitle>
          <DisplayField label="" value={data.COMENTARIOS} />
        </>
      )}
    </div>
  );
};

export default ExternoDisplay;
