import React, { useState, useCallback } from 'react';
import { useTableData, useCrudForms, CrudMultiLevelManager } from '@/features/crud';
import {
  almacenesTableConfig,
  almacenesLevelConfigs,
  almacenesFormFields,
  almacenesMultiStep,
  almacenesValidation,
  almacenesModalConfig,
  almacenesHeaderProps,
  infraestructuraFormFields,
  infraestructuraValidation,
  infraestructuraModalConfig
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
 * AlmacenesCrud — Componente CRUD multilevel para ALMACENES por INFRAESTRUCTURA.
 * Muestra infraestructuras como grupos y permite agregar almacenes dentro de cada una.
 *
 * @param {Object} props
 * @param {Object} props.config - Configuración completa para sobrescribir valores por defecto
 * @param {Object} props.headerOverrides - Props opcionales para sobreescribir el header (legacy)
 * @param {Object} props.tableOverrides  - levelConfigs modificados (legacy)
 */
function AlmacenesCrud({ config = {}, headerOverrides = {}, tableOverrides = {} }) {
  // Merge config con valores por defecto
  const mergedConfig = deepMerge({
    tableName: almacenesTableConfig.tableName,
    levelConfigs: almacenesLevelConfigs,
    formFields: almacenesFormFields,
    multiStep: almacenesMultiStep,
    validation: almacenesValidation,
    modalConfig: almacenesModalConfig,
    headerProps: almacenesHeaderProps,
    infraestructura: {
      formFields: infraestructuraFormFields,
      validation: infraestructuraValidation,
      modalConfig: infraestructuraModalConfig
    }
  }, config);

  const { records, loading, error, refresh } = useTableData(mergedConfig.tableName);

  // CRUD para Almacenes (nivel 2)
  const crudAlmacenes = useCrudForms({
    tableName: 'ALMACENES',
    primaryKey: 'ID_ALMACEN',
    onRefresh: refresh
  });

  // CRUD para Infraestructuras (nivel 1 - header)
  const crudInfraestructuras = useCrudForms({
    tableName: 'INFRAESTRUCTURAS',
    primaryKey: 'ID_INFRAESTRUCTURA',
    onRefresh: refresh
  });

  // Estado para ID_INFRAESTRUCTURA seleccionada al agregar almacen
  const [selectedInfraestructuraId, setSelectedInfraestructuraId] = useState(null);

  // Handler para agregar almacen desde un grupo de infraestructura
  const handleAddAlmacen = useCallback((infraRow) => {
    setSelectedInfraestructuraId(infraRow.ID_INFRAESTRUCTURA);
    crudAlmacenes.handleCreate();
  }, [crudAlmacenes]);

  // Preparar form fields de almacen con ID_INFRAESTRUCTURA predefinido
  const almacenesFormFieldsWithDefault = mergedConfig.formFields.map(field => {
    if (field.name === 'ID_INFRAESTRUCTURA' && selectedInfraestructuraId) {
      return { ...field, defaultValue: selectedInfraestructuraId, disabled: true };
    }
    return field;
  });

  // Config de niveles con acciones
  const levelConfigs = tableOverrides.levelConfigs ?? mergedConfig.levelConfigs.map((level, idx) => {
    const isLevel1 = idx === 0; // Infraestructura
    const isLevel2 = idx === 1; // Almacen

    return {
      ...level,
      actions: isLevel1 ? {
        // Acciones para nivel 1 (Infraestructura): Editar, Eliminar, Agregar Almacen
        edit: {
          enabled: true,
          icon: 'edit',
          label: 'Editar',
          className: 'text-blue-600 hover:bg-blue-100',
          onClick: (row) => crudInfraestructuras.handleEdit(row)
        },
        delete: {
          enabled: true,
          icon: 'trash',
          label: 'Eliminar',
          className: 'text-red-600 hover:bg-red-100',
          onClick: (row) => crudInfraestructuras.handleDelete(row)
        },
        addChild: {
          enabled: true,
          icon: 'plus',
          label: 'Agregar Almacén',
          className: 'text-green-600 hover:bg-green-100',
          onClick: (row) => handleAddAlmacen(row)
        }
      } : isLevel2 ? {
        // Acciones para nivel 2 (Almacen): Editar, Eliminar
        edit: {
          enabled: true,
          icon: 'edit',
          label: 'Editar',
          className: 'text-blue-600 hover:bg-blue-100',
          onClick: (row) => crudAlmacenes.handleEdit(row)
        },
        delete: {
          enabled: true,
          icon: 'trash',
          label: 'Eliminar',
          className: 'text-red-600 hover:bg-red-100',
          onClick: (row) => crudAlmacenes.handleDelete(row)
        }
      } : {}
    };
  });

  // CRUD Levels: Infraestructura (0) y Almacenes (1)
  const crudLevels = [
    {
      crud: crudInfraestructuras,
      tableName: 'INFRAESTRUCTURAS',
      primaryKey: 'ID_INFRAESTRUCTURA',
      formFields: mergedConfig.infraestructura?.formFields || infraestructuraFormFields,
      formLayout: null,
      multiStep: null,
      validation: mergedConfig.infraestructura?.validation || infraestructuraValidation,
      confirmSubmit: true,
      modalConfig: mergedConfig.infraestructura?.modalConfig || infraestructuraModalConfig
    },
    {
      crud: crudAlmacenes,
      tableName: 'ALMACENES',
      primaryKey: 'ID_ALMACEN',
      formFields: almacenesFormFieldsWithDefault,
      formLayout: null,
      multiStep: mergedConfig.multiStep || almacenesMultiStep,
      validation: mergedConfig.validation || almacenesValidation,
      confirmSubmit: true,
      modalConfig: mergedConfig.modalConfig || almacenesModalConfig,
      onCreateClose: () => setSelectedInfraestructuraId(null)
    }
  ];

  const headerProps = {
    ...mergedConfig.headerProps,
    ...headerOverrides,
    actions: [
      {
        text: mergedConfig.headerProps?.createButtonText || 'Registrar Infraestructura',
        onClick: crudInfraestructuras.handleCreate,
        className: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium'
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

export default AlmacenesCrud;
