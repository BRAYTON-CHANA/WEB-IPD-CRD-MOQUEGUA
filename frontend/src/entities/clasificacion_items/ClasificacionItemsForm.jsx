import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { clasificacionItemsFormFields, clasificacionItemsValidation, clasificacionItemsMultiStep } from './config';

/**
 * ClasificacionItemsForm — Formulario pre-configurado para CLASIFICACION_ITEMS.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function ClasificacionItemsForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="CLASIFICACION_ITEMS"
      primaryKey="ID_CLASIFICACION"
      mode={mode}
      recordId={recordId}
      fields={clasificacionItemsFormFields}
      validation={clasificacionItemsValidation}
      multiStep={clasificacionItemsMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default ClasificacionItemsForm;
