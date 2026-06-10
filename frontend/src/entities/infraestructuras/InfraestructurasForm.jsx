import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { infraestructurasFormFields, infraestructurasValidation, infraestructurasMultiStep } from './config';

/**
 * InfraestructurasForm — Formulario pre-configurado para INFRAESTRUCTURAS.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function InfraestructurasForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="INFRAESTRUCTURAS"
      primaryKey="ID_INFRAESTRUCTURA"
      mode={mode}
      recordId={recordId}
      fields={infraestructurasFormFields}
      validation={infraestructurasValidation}
      multiStep={infraestructurasMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default InfraestructurasForm;
