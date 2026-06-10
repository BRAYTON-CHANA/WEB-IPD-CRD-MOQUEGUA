import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { almacenesFormFields, almacenesValidation, almacenesMultiStep } from './config';

/**
 * AlmacenesForm — Formulario pre-configurado para ALMACENES.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function AlmacenesForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="ALMACENES"
      primaryKey="ID_ALMACEN"
      mode={mode}
      recordId={recordId}
      fields={almacenesFormFields}
      validation={almacenesValidation}
      multiStep={almacenesMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default AlmacenesForm;
