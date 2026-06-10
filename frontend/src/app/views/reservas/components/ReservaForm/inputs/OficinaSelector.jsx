import React from 'react';
import ReferenceSelectInput from '@/shared/components/ui/inputs/ReferenceSelectInput';

const OficinaSelector = ({ value, onChange, formData }) => (
  <ReferenceSelectInput
    name="id_oficina"
    label="Buscar Oficina *"
    referenceTable="OFICINAS"
    referenceField="ID_OFICINA"
    referenceLabelField="NOMBRE_OFICINA"
    value={value}
    onChange={onChange}
    formData={formData}
    searchable
    required
  />
);

export default OficinaSelector;
