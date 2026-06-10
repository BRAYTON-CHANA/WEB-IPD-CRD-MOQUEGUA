import React from 'react';
import ReferenceSelectInput from '@/shared/components/ui/inputs/ReferenceSelectInput';

const EmpleadoSelector = ({ value, onChange, formData }) => (
  <ReferenceSelectInput
    name="id_empleado"
    label="Buscar Empleado *"
    referenceTable="vw_empleados_completo"
    referenceField="ID_EMPLEADO"
    referenceLabelField="EMPLEADO_NOMBRES"
    value={value}
    onChange={onChange}
    formData={formData}
    searchable
    required
  />
);

export default EmpleadoSelector;
