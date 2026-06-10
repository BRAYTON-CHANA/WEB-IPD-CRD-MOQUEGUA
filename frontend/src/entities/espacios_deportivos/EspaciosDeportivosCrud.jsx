import React, { useState, useCallback } from 'react';
import { useTableData, useCrudForms, CrudMultiLevelManager } from '@/features/crud';
import {
  espaciosDeportivosTableConfig,
  espaciosDeportivosLevelConfigs,
  espaciosDeportivosFormFields,
  espaciosDeportivosMultiStep,
  espaciosDeportivosValidation,
  espaciosDeportivosModalConfig,
  espaciosDeportivosHeaderProps,
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
 * EspaciosDeportivosCrud — Componente CRUD multilevel para ESPACIOS_DEPORTIVOS por INFRAESTRUCTURA.
 * Muestra infraestructuras como grupos y permite agregar espacios dentro de cada una.
 *
 * @param {Object} props
 * @param {Object} props.config - Configuración completa para sobrescribir valores por defecto
 * @param {Object} props.headerOverrides - Props opcionales para sobreescribir el header (legacy)
 * @param {Object} props.tableOverrides  - levelConfigs modificados (legacy)
 */
function EspaciosDeportivosCrud({ config = {}, headerOverrides = {}, tableOverrides = {} }) {
  // Merge config con valores por defecto
  const mergedConfig = deepMerge({
    tableName: espaciosDeportivosTableConfig.tableName,
    levelConfigs: espaciosDeportivosLevelConfigs,
    formFields: espaciosDeportivosFormFields,
    multiStep: espaciosDeportivosMultiStep,
    validation: espaciosDeportivosValidation,
    modalConfig: espaciosDeportivosModalConfig,
    headerProps: espaciosDeportivosHeaderProps,
    infraestructura: {
      formFields: infraestructuraFormFields,
      validation: infraestructuraValidation,
      modalConfig: infraestructuraModalConfig
    }
  }, config);

  const { records, loading, error, refresh } = useTableData(mergedConfig.tableName);

  // CRUD para Espacios (nivel 2)
  const crudEspacios = useCrudForms({
    tableName: 'ESPACIOS_DEPORTIVOS',
    primaryKey: 'ID_ESPACIO_DEPORTIVO',
    onRefresh: refresh
  });

  // CRUD para Infraestructuras (nivel 1 - header)
  const crudInfraestructuras = useCrudForms({
    tableName: 'INFRAESTRUCTURAS',
    primaryKey: 'ID_INFRAESTRUCTURA',
    onRefresh: refresh
  });

  // Estado para ID_INFRAESTRUCTURA seleccionada al agregar espacio
  const [selectedInfraestructuraId, setSelectedInfraestructuraId] = useState(null);

  // Handler para agregar espacio desde un grupo de infraestructura
  const handleAddEspacio = useCallback((infraRow) => {
    setSelectedInfraestructuraId(infraRow.ID_INFRAESTRUCTURA);
    crudEspacios.handleCreate();
  }, [crudEspacios]);

  // Preparar form fields de espacio con ID_INFRAESTRUCTURA predefinido
  const espaciosFormFieldsWithDefault = mergedConfig.formFields.map(field => {
    if (field.name === 'ID_INFRAESTRUCTURA' && selectedInfraestructuraId) {
      return { ...field, defaultValue: selectedInfraestructuraId, disabled: true };
    }
    return field;
  });

  // Config de niveles con acciones
  const levelConfigs = tableOverrides.levelConfigs ?? mergedConfig.levelConfigs.map((level, idx) => {
    const isLevel1 = idx === 0; // Infraestructura
    const isLevel2 = idx === 1; // Espacio

    return {
      ...level,
      actions: isLevel1 ? {
        // Acciones para nivel 1 (Infraestructura): Editar, Eliminar, Agregar Espacio
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
          label: 'Agregar Espacio',
          className: 'text-green-600 hover:bg-green-100',
          onClick: (row) => handleAddEspacio(row)
        }
      } : isLevel2 ? {
        // Acciones para nivel 2 (Espacio): Editar, Eliminar
        edit: {
          enabled: true,
          icon: 'edit',
          label: 'Editar',
          className: 'text-blue-600 hover:bg-blue-100',
          onClick: (row) => crudEspacios.handleEdit(row)
        },
        delete: {
          enabled: true,
          icon: 'trash',
          label: 'Eliminar',
          className: 'text-red-600 hover:bg-red-100',
          onClick: (row) => crudEspacios.handleDelete(row)
        }
      } : {}
    };
  });

  // CRUD Levels: Infraestructura (0) y Espacios (1)
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
      crud: crudEspacios,
      tableName: 'ESPACIOS_DEPORTIVOS',
      primaryKey: 'ID_ESPACIO_DEPORTIVO',
      formFields: espaciosFormFieldsWithDefault,
      formLayout: null,
      multiStep: mergedConfig.multiStep || espaciosDeportivosMultiStep,
      validation: mergedConfig.validation || espaciosDeportivosValidation,
      confirmSubmit: true,
      modalConfig: mergedConfig.modalConfig || espaciosDeportivosModalConfig,
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

export default EspaciosDeportivosCrud;
