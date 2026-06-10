import React from 'react';
import ReferenceSelectInput from '@/shared/components/ui/inputs/ReferenceSelectInput';

const ExternoSelector = ({ value, onChange, onNuevo, formData }) => (
  <div className="space-y-3">
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <ReferenceSelectInput
          name="id_externo"
          label="Buscar Externo *"
          referenceTable="EXTERNOS"
          referenceField="ID_EXTERNO"
          referenceQuery="{NOMBRE_O_ORGANIZACION} {APELLIDO_O_TIPO_SOCIEDAD} - DNI/RUC: {DNI_RUC}"
          value={value}
          onChange={onChange}
          formData={formData}
          searchable
          required
        />
      </div>
      <button
        type="button"
        onClick={onNuevo}
        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm whitespace-nowrap"
      >
        + Nuevo Externo
      </button>
    </div>
  </div>
);

export default ExternoSelector;
