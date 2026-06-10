/**
 * Configuración de página ALMACENES
 * Tabla: ALMACENES | PK: ID_ALMACEN
 * Depende de: INFRAESTRUCTURAS, EMPLEADOS
 * View: vw_almacenes_por_infraestructura (multilevel)
 * 
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
 */

export const almacenesTableConfig = {
  tableName: 'vw_almacenes_por_infraestructura'
};

export const almacenesLevelConfigs = [
  {
    level: 1,
    field: 'INFRAESTRUCTURA',
    headers: [
      { title: 'TIPO_INFRAESTRUCTURA', type: 'string' },
    ],
    boundColumn: 'ID_INFRAESTRUCTURA',
    groupActions: true
  },
  {
    level: 2,
    headers: [
      { title: 'NOMBRE_ALMACEN',      type: 'string' },
      { title: 'TIPO_ALMACEN',      type: 'string' },     
    ],
    boundColumn: 'ID_ALMACEN'
  }
];

export const almacenesFormFields = [
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
    name: 'NOMBRE_ALMACEN',
    type: 'text',
    label: 'Nombre del Almacén',
    required: true,
    placeholder: 'Ej: Almacén Central, Depósito Norte'
  },
  {
    name: 'TIPO_ALMACEN',
    type: 'unique-select',
    label: 'Tipo de Almacén',
    required: false,
    tableName: 'ALMACENES',
    columnName: 'TIPO_ALMACEN',
    allowCreate: true,
    createTitle: 'Agregar Tipo de Almacén',
    searchable: false,
    placeholder: 'Ej: General, Deportivo, Administrativo...'
  },
  {
    name: 'ID_EMPLEADO_RESPONSABLE',
    type: 'reference-select',
    label: 'Empleado Responsable',
    required: false,
    referenceTable: 'EMPLEADOS',
    referenceField: 'ID_EMPLEADO',
    referenceQuery: '{NOMBRES} {APELLIDOS}',
    referenceFilters: [
      { field: 'ACTIVO', op: '=', value: true }
    ],
    placeholder: 'Seleccione un responsable (opcional)'
  },
  {
    name: 'RESPONSABLE_NOTAS',
    type: 'text',
    label: 'Notas del Responsable',
    required: false,
    placeholder: 'Ej: Llave en portería'
  },
  {
    name: 'COMENTARIOS',
    type: 'textarea',
    label: 'Comentarios',
    required: false,
    placeholder: 'Observaciones adicionales...',
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

export const almacenesMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Almacén'
};

export const almacenesValidation = {
  ID_INFRAESTRUCTURA: {
    required: { value: true, message: 'Debe seleccionar una infraestructura' }
  },
  NOMBRE_ALMACEN: {
    required: { value: true, message: 'El nombre del almacén es obligatorio' }
  }
};

export const almacenesModalConfig = {
  createTitle: 'Registrar Almacén',
  editTitle: 'Editar Almacén',
  deleteTitle: '¿Eliminar almacén?',
  deleteMessage: (row) => `¿Estás seguro de eliminar el almacén "${row?.NOMBRE_ALMACEN}"?`
};

export const almacenesHeaderProps = {
  headerTitle: 'Almacenes por Infraestructura',
  headerDescription: 'Administra los almacenes y depósitos agrupados por infraestructura'
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
