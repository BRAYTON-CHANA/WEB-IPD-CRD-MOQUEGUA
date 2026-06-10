import React from 'react';
import { useTableData, useCrudForms, CrudMultiLevelManager } from '@/features/crud';
import {
  programasDeportivosTableConfig,
  programasDeportivosLevelConfigs,
  programasDeportivosFormFields,
  programasDeportivosMultiStep,
  programasDeportivosValidation,
  programasDeportivosModalConfig,
  programasDeportivosHeaderProps
} from './config';

/**
 * Deep merge de objetos (simple, no arrays)
 */
const deepMerge = (target, source) => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

/**
 * ProgramasDeportivosCrud — Componente CRUD pre-armado para PROGRAMAS_DEPORTIVOS.
 * Listo para montar dentro de cualquier página con Layout.
 *
 * @param {Object} config          - Configuración completa para sobrescribir valores por defecto
 * @param {Object} headerOverrides - Props opcionales para sobreescribir el header (legacy)
 * @param {Object} tableOverrides  - levelConfigs modificados (legacy)
 */
function ProgramasDeportivosCrud({ config = {}, headerOverrides = {}, tableOverrides = {} }) {
  const mergedConfig = deepMerge({
    tableName: programasDeportivosTableConfig.tableName,
    levelConfigs: programasDeportivosLevelConfigs,
    formFields: programasDeportivosFormFields,
    multiStep: programasDeportivosMultiStep,
    validation: programasDeportivosValidation,
    modalConfig: programasDeportivosModalConfig,
    headerProps: programasDeportivosHeaderProps
  }, config);

  const { records, loading, error, refresh } = useTableData(mergedConfig.tableName);

  const crud = useCrudForms({
    tableName: 'PROGRAMAS_DEPORTIVOS',
    primaryKey: 'ID_PROGRAMA',
    onRefresh: refresh
  });

  const levelConfigs = tableOverrides.levelConfigs ?? mergedConfig.levelConfigs.map(level => ({
    ...level,
    actions: {
      edit: {
        enabled: true,
        icon: 'edit',
        label: 'Editar',
        className: 'text-blue-600 hover:bg-blue-100',
        onClick: (row) => crud.handleEdit(row)
      },
      delete: {
        enabled: true,
        icon: 'trash',
        label: 'Eliminar',
        className: 'text-red-600 hover:bg-red-100',
        onClick: (row) => crud.handleDelete(row)
      }
    }
  }));

  const crudLevels = [
    {
      crud,
      tableName: 'PROGRAMAS_DEPORTIVOS',
      primaryKey: 'ID_PROGRAMA',
      formFields: mergedConfig.formFields,
      formLayout: null,
      multiStep: mergedConfig.multiStep,
      validation: mergedConfig.validation,
      confirmSubmit: true,
      modalConfig: mergedConfig.modalConfig
    }
  ];

  const headerProps = {
    ...mergedConfig.headerProps,
    ...headerOverrides,
    actions: [
      {
        text: mergedConfig.headerProps?.createButtonText || 'Registrar Programa',
        onClick: crud.handleCreate,
        font: 'bg-green-600 hover:bg-green-700 text-white'
      },
      ...(headerOverrides.extraActions ?? [])
    ]
  };

  return (
    <CrudMultiLevelManager
      data={records}
      loading={loading}
      error={error}
      tableLevelConfigs={levelConfigs}
      headerProps={headerProps}
      crudLevels={crudLevels}
    />
  );
}

export default ProgramasDeportivosCrud;
