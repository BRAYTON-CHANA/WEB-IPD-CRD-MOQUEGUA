/**
 * Configuración de página CLASIFICACION_ITEMS
 * Tabla: CLASIFICACION_ITEMS | PK: ID_CLASIFICACION
 *
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
 */

export const clasificacionItemsTableConfig = {
  tableName: 'CLASIFICACION_ITEMS'
};

export const clasificacionItemsLevelConfigs = [
  {
    level: 1,
    field: 'NOMBRE',
    headers: [
      { title: 'CODIGO',      type: 'string' },
      { title: 'CATEGORIA',   type: 'string' },
      { title: 'UNIDAD_MEDIDA', type: 'string' },
      { title: 'ACTIVO',      type: 'boolean' }
    ],
    boundColumn: 'ID_CLASIFICACION'
  }
];

export const clasificacionItemsFormFields = [
  {
    name: 'CODIGO',
    type: 'text',
    label: 'Código',
    required: false,
    placeholder: 'Ej: MOB-001, DEP-BALL-001'
  },
  {
    name: 'NOMBRE',
    type: 'text',
    label: 'Nombre del Ítem',
    required: true,
    placeholder: 'Ej: Silla, Pelota de Fútbol, Escritorio'
  },
  {
    name: 'CATEGORIA',
    type: 'unique-select',
    label: 'Categoría',
    required: false,
    tableName: 'CLASIFICACION_ITEMS',
    columnName: 'CATEGORIA',
    allowCreate: true,
    createTitle: 'Agregar Categoría',
    searchable: false,
    placeholder: 'Ej: Mobiliario, Material Deportivo, Electrónico...'
  },
  {
    name: 'UNIDAD_MEDIDA',
    type: 'unique-select',
    label: 'Unidad de Medida',
    required: false,
    tableName: 'CLASIFICACION_ITEMS',
    columnName: 'UNIDAD_MEDIDA',
    allowCreate: true,
    createTitle: 'Agregar Unidad de Medida',
    searchable: false,
    placeholder: 'Ej: Unidad, Kg, Litro, Metro...'
  },
  {
    name: 'DESCRIPCION',
    type: 'textarea',
    label: 'Descripción',
    required: false,
    placeholder: 'Descripción detallada del ítem...',
    rows: 3
  },
  {
    name: 'COMENTARIOS',
    type: 'textarea',
    label: 'Comentarios',
    required: false,
    placeholder: 'Observaciones adicionales...',
    rows: 2
  },
  {
    name: 'ACTIVO',
    type: 'boolean',
    label: 'Activo',
    required: false,
    defaultValue: true
  }
];

export const clasificacionItemsMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Clasificación'
};

export const clasificacionItemsValidation = {
  NOMBRE: {
    required: { value: true, message: 'El nombre del ítem es obligatorio' }
  }
};

export const clasificacionItemsModalConfig = {
  createTitle: 'Registrar Clasificación de Ítem',
  editTitle: 'Editar Clasificación de Ítem',
  deleteTitle: '¿Eliminar clasificación?',
  deleteMessage: (row) => `¿Estás seguro de eliminar la clasificación "${row?.NOMBRE}"?`
};

export const clasificacionItemsHeaderProps = {
  headerTitle: 'Clasificación de Ítems',
  headerDescription: 'Administra el catálogo de clasificaciones de ítems de inventario'
};
