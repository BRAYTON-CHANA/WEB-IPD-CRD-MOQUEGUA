import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { espaciosDeportivosFormFields, espaciosDeportivosValidation, espaciosDeportivosMultiStep } from './config';

/**
 * EspaciosDeportivosForm — Formulario pre-configurado para ESPACIOS_DEPORTIVOS.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function EspaciosDeportivosForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="ESPACIOS_DEPORTIVOS"
      primaryKey="ID_ESPACIO_DEPORTIVO"
      mode={mode}
      recordId={recordId}
      fields={espaciosDeportivosFormFields}
      validation={espaciosDeportivosValidation}
      multiStep={espaciosDeportivosMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default EspaciosDeportivosForm;
