import React from 'react';

const DNI_RUC_REGEX = /^\d{8}$|^\d{11}$/;

const NuevoExternoForm = ({ data, onChange }) => {
  const isJuridica = data.es_persona_juridica === 'juridica';
  const esMenor = data.es_menor_de_edad === true || data.es_menor_de_edad === 'true';
  const [dniTouched, setDniTouched] = React.useState(false);
  const dniValido = !data.dni_ruc || DNI_RUC_REGEX.test(data.dni_ruc);
  const mostrarErrorDni = dniTouched && data.dni_ruc && !dniValido;

  return (
    <div className="space-y-4">
      {/* TIPO */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Tipo *</label>
        <select
          value={data.es_persona_juridica}
          onChange={(e) => onChange('es_persona_juridica', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
        >
          <option value="natural">Persona Natural</option>
          <option value="juridica">Organización / Empresa</option>
        </select>
      </div>

      {/* NOMBRE / RAZON SOCIAL */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {isJuridica ? 'Razón Social *' : 'Nombres *'}
          </label>
          <input
            type="text"
            value={data.nombre_o_organizacion}
            onChange={(e) => onChange('nombre_o_organizacion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            placeholder={isJuridica ? 'Ej: Empresa SAC' : 'Ej: Juan'}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {isJuridica ? 'Tipo Sociedad' : 'Apellidos'}
          </label>
          <input
            type="text"
            value={data.apellido_o_tipo_sociedad}
            onChange={(e) => onChange('apellido_o_tipo_sociedad', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            placeholder={isJuridica ? 'Ej: S.A.C.' : 'Ej: García'}
          />
        </div>
      </div>

      {/* DNI/RUC + TELEFONO */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {isJuridica ? 'RUC *' : 'DNI *'}
          </label>
          <input
            type="text"
            value={data.dni_ruc}
            onChange={(e) => onChange('dni_ruc', e.target.value)}
            onBlur={() => setDniTouched(true)}
            className={`w-full px-3 py-2 border rounded text-sm focus:ring-2 transition ${
              mostrarErrorDni
                ? 'border-red-500 focus:ring-red-500 bg-red-50'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder={isJuridica ? '20123456789' : '12345678'}
          />
          {mostrarErrorDni ? (
            <p className="text-xs text-red-600 mt-1">
              {isJuridica ? 'El RUC debe tener 11 dígitos numéricos' : 'El DNI debe tener 8 dígitos numéricos'}
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              {isJuridica ? '11 dígitos numéricos (RUC)' : '8 dígitos numéricos (DNI)'}
            </p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
          <input
            type="text"
            value={data.telefono_contacto}
            onChange={(e) => onChange('telefono_contacto', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            placeholder="951234567"
          />
        </div>
      </div>

      {/* CORREO + DOMICILIO */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Correo</label>
        <input
          type="email"
          value={data.correo_contacto}
          onChange={(e) => onChange('correo_contacto', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="contacto@email.com"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Domicilio</label>
        <textarea
          value={data.domicilio_ubicacion}
          onChange={(e) => onChange('domicilio_ubicacion', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Dirección completa..."
        />
      </div>

      {/* ES_MENOR_DE_EDAD - solo persona natural */}
      {!isJuridica && (
        <div className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            id="es_menor"
            checked={esMenor}
            onChange={(e) => onChange('es_menor_de_edad', e.target.checked)}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="es_menor" className="text-sm text-gray-700">
            Es menor de edad
          </label>
        </div>
      )}

      {/* DATOS DEL TUTOR - solo si es menor */}
      {!isJuridica && esMenor && (
        <div className="pl-4 border-l-2 border-blue-300 space-y-3 py-2">
          <p className="text-sm font-semibold text-blue-700">👨‍👩‍👧 Datos del Tutor</p>
          <input
            type="text"
            placeholder="Nombre completo del tutor *"
            value={data.tutor_nombre_completo}
            onChange={(e) => onChange('tutor_nombre_completo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="DNI del tutor"
              value={data.tutor_dni}
              onChange={(e) => onChange('tutor_dni', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Teléfono del tutor"
              value={data.tutor_telefono}
              onChange={(e) => onChange('tutor_telefono', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <input
            type="text"
            placeholder="Parentesco (Ej: Padre, Madre, Tío)"
            value={data.tutor_parentesco}
            onChange={(e) => onChange('tutor_parentesco', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* CONTACTO EMERGENCIA - solo persona natural */}
      {!isJuridica && (
        <div className="space-y-2 py-2">
          <p className="text-sm font-semibold text-gray-600">🚨 Contacto de Emergencia</p>
          <input
            type="text"
            placeholder="Nombre de contacto"
            value={data.emergencia_nombre}
            onChange={(e) => onChange('emergencia_nombre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Teléfono de emergencia"
            value={data.emergencia_telefono}
            onChange={(e) => onChange('emergencia_telefono', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* COMENTARIOS */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Comentarios</label>
        <textarea
          value={data.comentarios}
          onChange={(e) => onChange('comentarios', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Observaciones adicionales..."
        />
      </div>
    </div>
  );
};

export default NuevoExternoForm;
