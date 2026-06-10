import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { externosFormFields, externosValidation, externosMultiStep } from './config';

/**
 * ExternosForm — Formulario pre-configurado para EXTERNOS.
 * Incluye campos condicionales (tutor para menores, ocultamiento para personas jurídicas).
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function ExternosForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="EXTERNOS"
      primaryKey="ID_EXTERNO"
      mode={mode}
      recordId={recordId}
      fields={externosFormFields}
      validation={externosValidation}
      multiStep={externosMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default ExternosForm;
