/**
 * Configuración de página CARGOS
 * Tabla: CARGOS | PK: ID_CARGO
 *
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
 */

export const cargosTableConfig = {
  tableName: 'CARGOS'
};

export const cargosLevelConfigs = [
  {
    level: 1,
    field: 'NOMBRE_CARGO',
    headers: [
      { title: 'CARGO_ABREV', type: 'string' },
      { title: 'DESCRIPCION', type: 'string' },
      { title: 'ACTIVO',      type: 'boolean' }
    ],
    boundColumn: 'ID_CARGO'
  }
];

export const cargosFormFields = [
  {
    name: 'NOMBRE_CARGO',
    type: 'text',
    label: 'Nombre del Cargo',
    required: true,
    placeholder: 'Ej: Director General, Técnico Deportivo'
  },
  {
    name: 'CARGO_ABREV',
    type: 'text',
    label: 'Abreviación del Cargo',
    required: false,
    placeholder: 'Ej: Dir., Téc. Dep., Admin.'
  },
  {
    name: 'DESCRIPCION',
    type: 'textarea',
    label: 'Descripción',
    required: false,
    placeholder: 'Descripción de las funciones del cargo...',
    rows: 3
  },
  {
    name: 'ACTIVO',
    type: 'boolean',
    label: 'Activo',
    required: false,
    defaultValue: true
  }
];

export const cargosMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Cargo'
};

export const cargosValidation = {
  NOMBRE_CARGO: {
    required: { value: true, message: 'El nombre del cargo es obligatorio' }
  }
};

export const cargosModalConfig = {
  createTitle: 'Registrar Cargo',
  editTitle: 'Editar Cargo',
  deleteTitle: '¿Eliminar cargo?',
  deleteMessage: (row) => `¿Estás seguro de eliminar el cargo "${row?.NOMBRE_CARGO}"?`
};

export const cargosHeaderProps = {
  headerTitle: 'Cargos',
  headerDescription: 'Administra el catálogo de cargos institucionales del IPD'
};
