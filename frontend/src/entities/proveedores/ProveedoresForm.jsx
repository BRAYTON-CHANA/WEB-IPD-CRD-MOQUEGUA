import React from 'react';
import CrudForm from '@/features/form/views/CrudForm';
import { proveedoresFormFields, proveedoresValidation, proveedoresMultiStep } from './config';

/**
 * ProveedoresForm — Formulario pre-configurado para PROVEEDORES.
 * Usa CrudForm conectado al backend con la config de la entidad.
 *
 * @param {'create'|'edit'} mode      - Modo del formulario
 * @param {number|null}     recordId  - ID del registro a editar (solo mode='edit')
 * @param {Function}        onSuccess - Callback al guardar con éxito
 * @param {Function}        onError   - Callback en caso de error
 */
function ProveedoresForm({ mode = 'create', recordId = null, onSuccess, onError, ...props }) {
  return (
    <CrudForm
      tableName="PROVEEDORES"
      primaryKey="ID_PROVEEDOR"
      mode={mode}
      recordId={recordId}
      fields={proveedoresFormFields}
      validation={proveedoresValidation}
      multiStep={proveedoresMultiStep}
      onSuccess={onSuccess}
      onError={onError}
      {...props}
    />
  );
}

export default ProveedoresForm;
