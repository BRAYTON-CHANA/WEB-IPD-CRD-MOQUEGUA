import React from 'react';
import { useTableData, useCrudForms, CrudMultiLevelManager } from '@/features/crud';
import {
  infraestructurasTableConfig,
  infraestructurasLevelConfigs,
  infraestructurasFormFields,
  infraestructurasMultiStep,
  infraestructurasValidation,
  infraestructurasModalConfig,
  infraestructurasHeaderProps
} from './config';

/**
 * InfraestructurasCrud — Componente CRUD pre-armado para INFRAESTRUCTURAS.
 * Listo para montar dentro de cualquier página con Layout.
 *
 * @param {Object} headerOverrides - Props opcionales para sobreescribir el header
 * @param {Object} tableOverrides  - levelConfigs modificados
 */
function InfraestructurasCrud({ headerOverrides = {}, tableOverrides = {} }) {
  const { records, loading, error, refresh } = useTableData(infraestructurasTableConfig.tableName);

  const crud = useCrudForms({
    tableName: 'INFRAESTRUCTURAS',
    primaryKey: 'ID_INFRAESTRUCTURA',
    onRefresh: refresh
  });

  const levelConfigs = tableOverrides.levelConfigs ?? infraestructurasLevelConfigs.map(level => ({
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
      tableName: 'INFRAESTRUCTURAS',
      primaryKey: 'ID_INFRAESTRUCTURA',
      formFields: infraestructurasFormFields,
      formLayout: null,
      multiStep: infraestructurasMultiStep,
      validation: infraestructurasValidation,
      confirmSubmit: true,
      modalConfig: infraestructurasModalConfig
    }
  ];

  const headerProps = {
    ...infraestructurasHeaderProps,
    ...headerOverrides,
    actions: [
      {
        text: 'Registrar Infraestructura',
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

export default InfraestructurasCrud;
