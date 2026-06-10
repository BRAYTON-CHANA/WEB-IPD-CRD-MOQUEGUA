import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { disciplinasDeportivasFormFields, disciplinasDeportivasValidation, disciplinasDeportivasMultiStep } from './config';

/**
 * DisciplinasDeportivasForm — Formulario pre-configurado para DISCIPLINAS_DEPORTIVAS.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function DisciplinasDeportivasForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="DISCIPLINAS_DEPORTIVAS"
      primaryKey="ID_DISCIPLINA"
      mode={mode}
      recordId={recordId}
      fields={disciplinasDeportivasFormFields}
      validation={disciplinasDeportivasValidation}
      multiStep={disciplinasDeportivasMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default DisciplinasDeportivasForm;
