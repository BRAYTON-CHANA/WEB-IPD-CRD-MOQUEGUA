import React from 'react';
import TipoSelector from '../inputs/TipoSelector';
import ExternoSelector from '../inputs/ExternoSelector';
import EmpleadoSelector from '../inputs/EmpleadoSelector';
import OficinaSelector from '../inputs/OficinaSelector';
import SolicitanteData from '../sections/SolicitanteData';

const NuevoExternoHeader = ({ onCancelar }) => (
  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
    <span className="text-sm font-medium text-green-800">📝 Modo: Crear Nuevo Externo</span>
    <button
      type="button"
      onClick={onCancelar}
      className="text-sm text-green-700 hover:text-green-900 underline"
    >
      Volver a buscar
    </button>
  </div>
);

const SolicitantePage = ({
  formData,
  solicitanteData,
  modoExterno,
  nuevoExternoData,
  onChange,
  onNuevoExterno,
  onCancelarNuevoExterno,
  onNuevoExternoChange
}) => {
  const renderSelector = () => {
    if (formData.tipo_solicitante === 'EXTERNO' && modoExterno !== 'nuevo') {
      return (
        <ExternoSelector
          value={formData.id_externo}
          onChange={onChange}
          onNuevo={onNuevoExterno}
          formData={formData}
        />
      );
    }
    if (formData.tipo_solicitante === 'EMPLEADO') {
      return (
        <EmpleadoSelector
          value={formData.id_empleado}
          onChange={onChange}
          formData={formData}
        />
      );
    }
    if (formData.tipo_solicitante === 'OFICINA') {
      return (
        <OficinaSelector
          value={formData.id_oficina}
          onChange={onChange}
          formData={formData}
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <TipoSelector value={formData.tipo_solicitante} onChange={onChange} />

      {renderSelector()}

      {formData.tipo_solicitante === 'EXTERNO' && modoExterno === 'nuevo' && (
        <NuevoExternoHeader onCancelar={onCancelarNuevoExterno} />
      )}

      <SolicitanteData
        tipo={formData.tipo_solicitante}
        modo={modoExterno}
        data={solicitanteData}
        nuevoData={nuevoExternoData}
        onNuevoChange={onNuevoExternoChange}
      />
    </div>
  );
};

export default SolicitantePage;
