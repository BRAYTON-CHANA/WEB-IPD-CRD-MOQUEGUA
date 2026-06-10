import React, { useState, useMemo } from 'react';
import { useTableData, useCrudForms, CrudMultiLevelManager } from '@/features/crud';
import {
  externosTableConfig,
  externosViewTableConfig,
  externosLevelConfigs,
  externosHeaderSets,
  externosFormFields,
  externosMultiStep,
  externosValidation,
  externosModalConfig,
  externosHeaderProps
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

const MODOS = [
  {
    key: 'todos',
    label: 'Todos',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    filter: null,
    activeClass: 'bg-slate-700 text-white shadow-sm',
    countClass: 'bg-slate-600 text-slate-100'
  },
  {
    key: 'personas',
    label: 'Personas Naturales',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    filter: [{ column: 'ES_PERSONA_JURIDICA', op: '=', value: false }],
    activeClass: 'bg-blue-600 text-white shadow-sm',
    countClass: 'bg-blue-500 text-blue-100'
  },
  {
    key: 'organizaciones',
    label: 'Organizaciones',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    filter: [{ column: 'ES_PERSONA_JURIDICA', op: '=', value: true }],
    activeClass: 'bg-emerald-600 text-white shadow-sm',
    countClass: 'bg-emerald-500 text-emerald-100'
  }
];

/**
 * ExternosTipoSelector — Selector de tipo encima de la tabla
 */
function ExternosTipoSelector({ modoActivo, onModoChange, records }) {
  const counts = useMemo(() => ({
    todos: records.length,
    personas: records.filter(r => r.ES_PERSONA_JURIDICA === false).length,
    organizaciones: records.filter(r => r.ES_PERSONA_JURIDICA === true).length
  }), [records]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider mr-1">Mostrar:</span>
        {MODOS.map(modo => {
          const isActive = modoActivo === modo.key;
          return (
            <button
              key={modo.key}
              onClick={() => onModoChange(modo.key)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? modo.activeClass
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {modo.icon}
              <span>{modo.label}</span>
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                isActive ? modo.countClass : 'bg-gray-200 text-gray-500'
              }`}>
                {counts[modo.key]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ExternosCrud — Componente CRUD pre-armado para EXTERNOS.
 * Lee desde vw_externos (incluye TIPO_EXTERNO), escribe sobre tabla EXTERNOS.
 * Selector de tipo con headers dinámicos según modo.
 *
 * @param {Object} config          - Configuración completa para sobrescribir valores por defecto
 * @param {Object} headerOverrides - Props opcionales para sobreescribir el header (legacy)
 * @param {Object} tableOverrides  - levelConfigs modificados (legacy)
 */
function ExternosCrud({ config = {}, headerOverrides = {}, tableOverrides = {} }) {
  const [modoActivo, setModoActivo] = useState('todos');

  const mergedConfig = deepMerge({
    tableName: externosViewTableConfig.tableName,
    levelConfigs: externosLevelConfigs,
    headerSets: externosHeaderSets,
    formFields: externosFormFields,
    multiStep: externosMultiStep,
    validation: externosValidation,
    modalConfig: externosModalConfig,
    headerProps: externosHeaderProps
  }, config);

  const { records, loading, error, refresh } = useTableData(mergedConfig.tableName);

  const crud = useCrudForms({
    tableName: 'EXTERNOS',
    primaryKey: 'ID_EXTERNO',
    onRefresh: refresh
  });

  const modoConfig = MODOS.find(m => m.key === modoActivo);
  const currentHeaders = (mergedConfig.headerSets ?? externosHeaderSets)[modoActivo]
    ?? externosHeaderSets.todos;

  const externalLevel = mergedConfig.levelConfigs?.[0];
  const resolvedField = externalLevel?.field ?? 'NOMBRE_O_ORGANIZACION';
  const resolvedHeaders = externalLevel?.headers
    ?? currentHeaders.filter(h => h.title !== 'NOMBRE_O_ORGANIZACION');

  const levelConfigs = tableOverrides.levelConfigs ?? [
    {
      level: 1,
      field: resolvedField,
      fieldLabel: externalLevel?.fieldLabel ?? (modoActivo === 'organizaciones' ? 'Organización' : 'Nombre'),
      headers: resolvedHeaders,
      boundColumn: 'ID_EXTERNO',
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
    }
  ];

  const fixatedFilters = modoConfig?.filter ?? null;

  const crudLevels = [
    {
      crud,
      tableName: 'EXTERNOS',
      primaryKey: 'ID_EXTERNO',
      formFields: mergedConfig.formFields,
      formLayout: mergedConfig.formLayout || null,
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
        text: mergedConfig.headerProps?.createButtonText || 'Registrar Externo',
        onClick: crud.handleCreate,
        font: 'bg-green-600 hover:bg-green-700 text-white'
      },
      ...(headerOverrides.extraActions ?? [])
    ]
  };

  const toolbarSlot = (
    <ExternosTipoSelector
      modoActivo={modoActivo}
      onModoChange={setModoActivo}
      records={records}
    />
  );

  return (
    <CrudMultiLevelManager
      data={records}
      loading={loading}
      error={error}
      tableLevelConfigs={levelConfigs}
      fixatedFilters={fixatedFilters}
      headerProps={headerProps}
      toolbarSlot={toolbarSlot}
      crudLevels={crudLevels}
    />
  );
}

export default ExternosCrud;
