import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { oficinasFormFields, oficinasValidation, oficinasMultiStep } from './config';

/**
 * OficinasForm — Formulario pre-configurado para OFICINAS.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function OficinasForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="OFICINAS"
      primaryKey="ID_OFICINA"
      mode={mode}
      recordId={recordId}
      fields={oficinasFormFields}
      validation={oficinasValidation}
      multiStep={oficinasMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default OficinasForm;
