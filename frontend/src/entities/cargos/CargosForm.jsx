import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { cargosFormFields, cargosValidation, cargosMultiStep } from './config';

/**
 * CargosForm — Formulario pre-configurado para CARGOS.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function CargosForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="CARGOS"
      primaryKey="ID_CARGO"
      mode={mode}
      recordId={recordId}
      fields={cargosFormFields}
      validation={cargosValidation}
      multiStep={cargosMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default CargosForm;
