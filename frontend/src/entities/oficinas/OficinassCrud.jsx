import React, { useState, useCallback } from 'react';
import { useTableData, useCrudForms, CrudMultiLevelManager } from '@/features/crud';
import {
  oficinasTableConfig,
  oficinasLevelConfigs,
  oficinasFormFields,
  oficinasMultiStep,
  oficinasValidation,
  oficinasModalConfig,
  oficinasHeaderProps,
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
 * OficinasCrud — Componente CRUD multilevel para OFICINAS por INFRAESTRUCTURA.
 * Muestra infraestructuras como grupos y permite agregar oficinas dentro de cada una.
 *
 * @param {Object} props
 * @param {Object} props.config - Configuración completa para sobrescribir valores por defecto
 * @param {Object} props.headerOverrides - Props opcionales para sobreescribir el header (legacy)
 * @param {Object} props.tableOverrides  - levelConfigs modificados (legacy)
 */
function OficinasCrud({ config = {}, headerOverrides = {}, tableOverrides = {} }) {
  // Merge config con valores por defecto
  const mergedConfig = deepMerge({
    tableName: oficinasTableConfig.tableName,
    levelConfigs: oficinasLevelConfigs,
    formFields: oficinasFormFields,
    multiStep: oficinasMultiStep,
    validation: oficinasValidation,
    modalConfig: oficinasModalConfig,
    headerProps: oficinasHeaderProps,
    infraestructura: {
      formFields: infraestructuraFormFields,
      validation: infraestructuraValidation,
      modalConfig: infraestructuraModalConfig
    },
    empleado: {
      formFields: [],
      validation: {},
      modalConfig: {}
    }
  }, config);

  const { records, loading, error, refresh } = useTableData(mergedConfig.tableName);

  // CRUD para Oficinas (nivel 2)
  const crudOficinas = useCrudForms({
    tableName: 'OFICINAS',
    primaryKey: 'ID_OFICINA',
    onRefresh: refresh
  });

  // CRUD para Infraestructuras (nivel 1 - header)
  const crudInfraestructuras = useCrudForms({
    tableName: 'INFRAESTRUCTURAS',
    primaryKey: 'ID_INFRAESTRUCTURA',
    onRefresh: refresh
  });

  // Estado para IDs seleccionados al agregar
  const [selectedInfraestructuraId, setSelectedInfraestructuraId] = useState(null);
  const [selectedOficinaId, setSelectedOficinaId] = useState(null);

  // CRUD para Empleados (nivel 3)
  const crudEmpleados = useCrudForms({
    tableName: 'EMPLEADOS',
    primaryKey: 'ID_EMPLEADO',
    onRefresh: refresh
  });

  // Handler para agregar oficina desde un grupo de infraestructura
  const handleAddOficina = useCallback((infraRow) => {
    setSelectedInfraestructuraId(infraRow.ID_INFRAESTRUCTURA);
    crudOficinas.handleCreate();
  }, [crudOficinas]);

  // Handler para agregar empleado desde una oficina
  const handleAddEmpleado = useCallback((oficinaRow) => {
    setSelectedOficinaId(oficinaRow.ID_OFICINA);
    crudEmpleados.handleCreate();
  }, [crudEmpleados]);

  // Preparar form fields de oficina con ID_INFRAESTRUCTURA predefinido
  const oficinasFormFieldsWithDefault = mergedConfig.formFields.map(field => {
    if (field.name === 'ID_INFRAESTRUCTURA' && selectedInfraestructuraId) {
      return { ...field, defaultValue: selectedInfraestructuraId, disabled: true };
    }
    return field;
  });

  // Preparar form fields de empleado con ID_OFICINA predefinido
  const empleadoFormFieldsWithDefault = (mergedConfig.empleado?.formFields || []).map(field => {
    if (field.name === 'ID_OFICINA' && selectedOficinaId) {
      return { ...field, defaultValue: selectedOficinaId, disabled: true };
    }
    return field;
  });

  // Config de niveles con acciones
  const hasEmpleadoLevel = mergedConfig.levelConfigs.length >= 3;
  const levelConfigs = tableOverrides.levelConfigs ?? mergedConfig.levelConfigs.map((level, idx) => {
    const isLevel1 = idx === 0; // Infraestructura
    const isLevel2 = idx === 1; // Oficina
    const isLevel3 = idx === 2; // Empleado

    return {
      ...level,
      actions: isLevel1 ? {
        // Acciones para nivel 1 (Infraestructura): Editar, Eliminar, Agregar Oficina
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
          label: 'Agregar Oficina',
          className: 'text-green-600 hover:bg-green-100',
          onClick: (row) => handleAddOficina(row)
        }
      } : isLevel2 ? {
        // Acciones para nivel 2 (Oficina): Editar, Eliminar, Agregar Empleado (si hay nivel 3)
        edit: {
          enabled: true,
          icon: 'edit',
          label: 'Editar',
          className: 'text-blue-600 hover:bg-blue-100',
          onClick: (row) => crudOficinas.handleEdit(row)
        },
        delete: {
          enabled: true,
          icon: 'trash',
          label: 'Eliminar',
          className: 'text-red-600 hover:bg-red-100',
          onClick: (row) => crudOficinas.handleDelete(row)
        },
        ...(hasEmpleadoLevel ? {
          addChild: {
            enabled: true,
            icon: 'plus',
            label: 'Agregar Empleado',
            className: 'text-purple-600 hover:bg-purple-100',
            onClick: (row) => handleAddEmpleado(row)
          }
        } : {})
      } : isLevel3 ? {
        // Acciones para nivel 3 (Empleado): Editar, Eliminar
        edit: {
          enabled: true,
          icon: 'edit',
          label: 'Editar',
          className: 'text-blue-600 hover:bg-blue-100',
          onClick: (row) => crudEmpleados.handleEdit(row)
        },
        delete: {
          enabled: true,
          icon: 'trash',
          label: 'Eliminar',
          className: 'text-red-600 hover:bg-red-100',
          onClick: (row) => crudEmpleados.handleDelete(row)
        }
      } : {}
    };
  });

  // CRUD Levels: Infraestructura (0), Oficinas (1), Empleados (2 - opcional)
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
      crud: crudOficinas,
      tableName: 'OFICINAS',
      primaryKey: 'ID_OFICINA',
      formFields: oficinasFormFieldsWithDefault,
      formLayout: null,
      multiStep: mergedConfig.multiStep || oficinasMultiStep,
      validation: mergedConfig.validation || oficinasValidation,
      confirmSubmit: true,
      modalConfig: mergedConfig.modalConfig || oficinasModalConfig,
      onCreateClose: () => setSelectedInfraestructuraId(null)
    },
    ...(hasEmpleadoLevel && mergedConfig.empleado?.formFields?.length > 0 ? [{
      crud: crudEmpleados,
      tableName: 'EMPLEADOS',
      primaryKey: 'ID_EMPLEADO',
      formFields: empleadoFormFieldsWithDefault,
      formLayout: null,
      multiStep: null,
      validation: mergedConfig.empleado?.validation || {},
      confirmSubmit: true,
      modalConfig: mergedConfig.empleado?.modalConfig || {},
      onCreateClose: () => setSelectedOficinaId(null)
    }] : [])
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

export default OficinasCrud;
