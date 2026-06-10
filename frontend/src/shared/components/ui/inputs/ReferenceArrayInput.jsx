import React from 'react';
import useReferenceData from '@/shared/hooks/useReferenceData';
import SelectInput from './SelectInput';

/**
 * ReferenceArrayInput - Multi-select con datos desde tabla de referencia
 * Usa SelectInput con multiSelect={true} para badges y selección múltiple
 */
const ReferenceArrayInput = React.memo(({
  name,
  label,
  referenceTable,
  referenceField,
  referenceLabelField,
  referenceQuery,
  referenceDescriptionField,
  referenceFilters,
  value,
  onChange,
  searchable = true,
  placeholder = 'Seleccione opciones...',
  blocked = false,
  hidden = false,
  formData = {}
}) => {
  // Cargar opciones desde tabla de referencia
  // NOTA: useReferenceData retorna { options, loading, refresh }, NO { data }
  const { options, loading, error } = useReferenceData({
    tableName: referenceTable,
    valueField: referenceField,
    labelField: referenceLabelField,
    labelTemplate: referenceQuery,
    descriptionField: referenceDescriptionField,
    filters: referenceFilters
  });


  // Asegurar que value sea array (memoizado para evitar re-renders)
  const normalizedValue = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (value === '' || value === null || value === undefined) return [];
    return [value];
  }, [value]);

  // Handler para cambios
  const handleChange = React.useCallback((fieldName, newValue) => {
    onChange?.(fieldName, newValue);
  }, [onChange]);

  if (hidden) return null;

  return (
    <div className={blocked ? 'pointer-events-none opacity-50' : ''}>
      <SelectInput
        name={name}
        label={label}
        options={options}
        value={normalizedValue}
        onChange={handleChange}
        multiSelect={true}
        searchable={searchable}
        loading={loading}
        placeholder={placeholder}
        optionValue="value"
        optionLabel="label"
        optionDescription="description"
      />
    </div>
  );
});

ReferenceArrayInput.displayName = 'ReferenceArrayInput';

export default ReferenceArrayInput;
