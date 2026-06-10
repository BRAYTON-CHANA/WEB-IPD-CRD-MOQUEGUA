/**
 * Configuración de página ESPACIOS_DEPORTIVOS
 * Tabla: ESPACIOS_DEPORTIVOS | PK: ID_ESPACIO_DEPORTIVO
 * Depende de: INFRAESTRUCTURAS
 * View: vw_espacios_por_infraestructura (multilevel)
 * 
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
 */

export const espaciosDeportivosTableConfig = {
  tableName: 'vw_espacios_por_infraestructura'
};

export const espaciosDeportivosLevelConfigs = [
  {
    level: 1,
    field: 'INFRAESTRUCTURA',
    headers: [
      { title: 'TIPO_INFRAESTRUCTURA', type: 'string' },
      { title: 'REGION', type: 'string' },
      //{ title: 'PROVINCIA', type: 'string' },
      //{ title: 'DISTRITO', type: 'string' },

    ],
    boundColumn: 'ID_INFRAESTRUCTURA',
    groupActions: true,
    childCountLabel: { singular: 'espacio', plural: 'espacios' }

  },
  {
    level: 2,

    headers: [
      { title: 'ESPACIO', type: 'string' },
      { title: 'TIPO_ESPACIO', type: 'string' },
      { title: 'CAPACIDAD',    type: 'number' },
  
    ],
    boundColumn: 'ID_ESPACIO_DEPORTIVO'
  }
];

export const espaciosDeportivosFormFields = [
  {
    name: 'ID_INFRAESTRUCTURA',
    type: 'reference-select',
    label: 'Infraestructura',
    required: true,
    referenceTable: 'INFRAESTRUCTURAS',
    referenceField: 'ID_INFRAESTRUCTURA',
    referenceQuery: '{NOMBRE}',
    referenceFilters: [
      { field: 'ACTIVO', op: '=', value: true }
    ],
    placeholder: 'Seleccione una infraestructura'
  },
  {
    name: 'NOMBRE',
    type: 'text',
    label: 'Nombre del Espacio',
    required: true,
    placeholder: 'Ej: Cancha Principal, Gimnasio Norte'
  },
  {
    name: 'TIPO',
    type: 'unique-select',
    label: 'Tipo',
    required: true,
    tableName: 'ESPACIOS_DEPORTIVOS',
    columnName: 'TIPO',
    allowCreate: true,
    createTitle: 'Agregar Tipo de Espacio',
    searchable: false,
    placeholder: 'Ej: Cancha de Fútbol, Gimnasio, Piscina...'
  },
  {
    name: 'CAPACIDAD',
    type: 'integer',
    label: 'Capacidad (personas)',
    required: true,
    min: 1,
    placeholder: 'Ej: 500'
  },
  {
    name: 'ACTIVO',
    type: 'boolean',
    label: 'Activo',
    required: false,
    defaultValue: true
  }
];

export const espaciosDeportivosMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Espacio Deportivo'
};

export const espaciosDeportivosValidation = {
  ID_INFRAESTRUCTURA: {
    required: { value: true, message: 'Debe seleccionar una infraestructura' }
  },
  NOMBRE: {
    required: { value: true, message: 'El nombre del espacio es obligatorio' }
  },
  TIPO: {
    required: { value: true, message: 'El tipo de espacio es obligatorio' }
  },
  CAPACIDAD: {
    required: { value: true, message: 'La capacidad es obligatoria' }
  }
};

export const espaciosDeportivosModalConfig = {
  createTitle: 'Registrar Espacio Deportivo',
  editTitle: 'Editar Espacio Deportivo',
  deleteTitle: '¿Eliminar espacio deportivo?',
  deleteMessage: (row) => `¿Estás seguro de eliminar el espacio "${row?.NOMBRE}"?`
};

export const espaciosDeportivosHeaderProps = {
  headerTitle: 'Espacios Deportivos por Infraestructura',
  headerDescription: 'Administra las canchas, gimnasios y recintos deportivos agrupados por infraestructura'
};

// Configuración para CRUD de Infraestructura (header)
export const infraestructuraFormFields = [
  {
    name: 'NOMBRE',
    type: 'text',
    label: 'Nombre de Infraestructura',
    required: true,
    placeholder: 'Ej: Estadio Municipal de Moquegua'
  },
  {
    name: 'TIPO',
    type: 'unique-select',
    label: 'Tipo',
    required: false,
    tableName: 'INFRAESTRUCTURAS',
    columnName: 'TIPO',
    allowCreate: true,
    createTitle: 'Agregar Tipo de Infraestructura',
    searchable: false,
    placeholder: 'Ej: Estadio, Coliseo, Polideportivo...'
  },
  {
    name: 'REGION',
    type: 'text',
    label: 'Región',
    required: false,
    placeholder: 'Ej: Moquegua'
  },
  {
    name: 'PROVINCIA',
    type: 'text',
    label: 'Provincia',
    required: false,
    placeholder: 'Ej: Mariscal Nieto'
  },
  {
    name: 'DISTRITO',
    type: 'text',
    label: 'Distrito',
    required: false,
    placeholder: 'Ej: Moquegua'
  },
  {
    name: 'DIRECCION_EXACTA',
    type: 'text',
    label: 'Dirección Exacta',
    required: false,
    placeholder: 'Ej: Av. La Paz 123'
  },
  {
    name: 'TELEFONO_CONTACTO',
    type: 'text',
    label: 'Teléfono de Contacto',
    required: false,
    placeholder: 'Ej: 053-123456'
  },
  {
    name: 'DESCRIPCION',
    type: 'textarea',
    label: 'Descripción',
    required: false,
    placeholder: 'Descripción general de la infraestructura...',
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

export const infraestructuraValidation = {
  NOMBRE: {
    required: { value: true, message: 'El nombre de la infraestructura es obligatorio' }
  }
};

export const infraestructuraModalConfig = {
  createTitle: 'Registrar Infraestructura',
  editTitle: 'Editar Infraestructura',
  deleteTitle: '¿Eliminar infraestructura?',
  deleteMessage: (row) => `¿Estás seguro de eliminar la infraestructura "${row?.NOMBRE}"?`
};
