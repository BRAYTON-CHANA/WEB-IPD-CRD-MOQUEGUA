/**
 * Configuración de entidad OFICINAS
 * Tabla: OFICINAS | PK: ID_OFICINA
 * Depende de: INFRAESTRUCTURAS
 * View: vw_oficinas_por_infraestructura (multilevel)
 */

export const oficinasTableConfig = {
  tableName: 'vw_oficinas_por_infraestructura'
};

export const oficinasLevelConfigs = [
  {
    level: 1,
    field: 'INFRAESTRUCTURA',
    headers: [
      { title: 'TIPO_INFRAESTRUCTURA', type: 'string' },
      { title: 'DISTRITO', type: 'string' }
    ],
    boundColumn: 'ID_INFRAESTRUCTURA',
    groupActions: true
  },
  {
    level: 2,
    field: 'OFICINA',
    headers: [
      { title: 'PISO_NIVEL',   type: 'string' },
      { title: 'COMENTARIOS',  type: 'string' },
      { title: 'ACTIVO',       type: 'boolean' }
    ],
    boundColumn: 'ID_OFICINA'
  }
];

export const oficinasFormFields = [
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
    name: 'NOMBRE_OFICINA',
    type: 'text',
    label: 'Nombre de la Oficina',
    required: true,
    placeholder: 'Ej: Oficina de Dirección'
  },
  {
    name: 'PISO_NIVEL',
    type: 'text',
    label: 'Piso / Nivel',
    required: false,
    placeholder: 'Ej: Piso 1, Sótano'
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

export const oficinasMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Oficina'
};

export const oficinasValidation = {
  ID_INFRAESTRUCTURA: {
    required: { value: true, message: 'Debe seleccionar una infraestructura' }
  },
  NOMBRE_OFICINA: {
    required: { value: true, message: 'El nombre de la oficina es obligatorio' }
  }
};

export const oficinasModalConfig = {
  createTitle: 'Registrar Oficina',
  editTitle: 'Editar Oficina',
  deleteTitle: '¿Eliminar oficina?',
  deleteMessage: (row) => `¿Estás seguro de eliminar la oficina "${row?.NOMBRE_OFICINA}"?`
};

export const oficinasHeaderProps = {
  headerTitle: 'Oficinas por Infraestructura',
  headerDescription: 'Administra las oficinas administrativas agrupadas por infraestructura'
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
