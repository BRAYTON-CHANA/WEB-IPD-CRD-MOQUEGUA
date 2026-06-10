import React from 'react';
import ExternoDisplay from '../displays/ExternoDisplay';
import EmpleadoDisplay from '../displays/EmpleadoDisplay';
import OficinaDisplay from '../displays/OficinaDisplay';
import NuevoExternoForm from './NuevoExternoForm';

const mapDbToForm = (data) => ({
  es_persona_juridica: data.ES_PERSONA_JURIDICA ? 'juridica' : 'natural',
  nombre_o_organizacion: data.NOMBRE_O_ORGANIZACION || '',
  apellido_o_tipo_sociedad: data.APELLIDO_O_TIPO_SOCIEDAD || '',
  dni_ruc: data.DNI_RUC || '',
  telefono_contacto: data.TELEFONO_CONTACTO || '',
  correo_contacto: data.CORREO_CONTACTO || '',
  domicilio_ubicacion: data.DOMICILIO_UBICACION || '',
  es_menor_de_edad: data.ES_MENOR_DE_EDAD || false,
  tutor_nombre_completo: data.TUTOR_NOMBRE_COMPLETO || '',
  tutor_dni: data.TUTOR_DNI || '',
  tutor_telefono: data.TUTOR_TELEFONO || '',
  tutor_parentesco: data.TUTOR_PARENTESCO || '',
  emergencia_nombre: data.EMERGENCIA_NOMBRE || '',
  emergencia_telefono: data.EMERGENCIA_TELEFONO || '',
  comentarios: data.COMENTARIOS || ''
});

const SolicitanteData = ({ tipo, modo, data, nuevoData, onNuevoChange }) => {
  if (!tipo) return null;

  // Modo nuevo externo: formulario editable (datos vacíos)
  if (tipo === 'EXTERNO' && modo === 'nuevo') {
    return (
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
          <span>📝</span> Datos del Nuevo Externo
        </h4>
        <NuevoExternoForm data={nuevoData} onChange={onNuevoChange} />
      </div>
    );
  }

  // Modo externo existente: mostrar todos los campos igual que al crear (read-only)
  if (tipo === 'EXTERNO' && modo === 'existente' && data) {
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <span>👁️</span> Datos del Externo Seleccionado
        </h4>
        <NuevoExternoForm data={mapDbToForm(data)} onChange={() => {}} />
      </div>
    );
  }

  // Mostrar datos de empleado u oficina
  const getDisplayComponent = () => {
    if (tipo === 'EMPLEADO') return <EmpleadoDisplay data={data} />;
    if (tipo === 'OFICINA') return <OficinaDisplay data={data} />;
    return null;
  };

  const displayComponent = getDisplayComponent();

  if (!displayComponent) return null;

  // Si no hay datos aún (no se ha seleccionado), mostrar mensaje
  const hasData = data && Object.keys(data).length > 0;
  if (!hasData) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-blue-600">👁️</span> Datos del Solicitante
        </h4>
        <p className="text-sm text-gray-500 italic text-center py-4">
          Seleccione un {tipo === 'EMPLEADO' ? 'empleado' : 'oficina'} para ver sus datos
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-blue-600">👁️</span> Datos del Solicitante
      </h4>
      {displayComponent}
    </div>
  );
};

export default SolicitanteData;
