import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { programasDeportivosFormFields, programasDeportivosValidation, programasDeportivosMultiStep } from './config';

/**
 * ProgramasDeportivosForm — Formulario pre-configurado para PROGRAMAS_DEPORTIVOS.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function ProgramasDeportivosForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="PROGRAMAS_DEPORTIVOS"
      primaryKey="ID_PROGRAMA"
      mode={mode}
      recordId={recordId}
      fields={programasDeportivosFormFields}
      validation={programasDeportivosValidation}
      multiStep={programasDeportivosMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default ProgramasDeportivosForm;
