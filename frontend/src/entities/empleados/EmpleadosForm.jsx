import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { empleadosFormFields, empleadosValidation, empleadosMultiStep } from './config';

/**
 * EmpleadosForm — Formulario pre-configurado para EMPLEADOS.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function EmpleadosForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="EMPLEADOS"
      primaryKey="ID_EMPLEADO"
      mode={mode}
      recordId={recordId}
      fields={empleadosFormFields}
      validation={empleadosValidation}
      multiStep={empleadosMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default EmpleadosForm;
