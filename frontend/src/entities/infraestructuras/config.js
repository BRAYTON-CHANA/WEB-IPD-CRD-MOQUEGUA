/**
 * Configuración de entidad INFRAESTRUCTURAS
 * Tabla: INFRAESTRUCTURAS | PK: ID_INFRAESTRUCTURA
 */

export const infraestructurasTableConfig = {
  tableName: 'INFRAESTRUCTURAS'
};

export const infraestructurasLevelConfigs = [
  {
    level: 1,
    field: 'NOMBRE',
    headers: [
      { title: 'TIPO',      type: 'string' },
      { title: 'DISTRITO',  type: 'string' },
      { title: 'PROVINCIA', type: 'string' },
      { title: 'REGION',    type: 'string' },
      { title: 'ACTIVO',    type: 'boolean' }
    ],
    boundColumn: 'ID_INFRAESTRUCTURA'
  }
];

export const infraestructurasFormFields = [
  {
    name: 'NOMBRE',
    type: 'text',
    label: 'Nombre',
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
    name: 'REFERENCIA',
    type: 'text',
    label: 'Referencia',
    required: false,
    placeholder: 'Ej: Frente al parque central'
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

export const infraestructurasMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Infraestructura'
};

export const infraestructurasValidation = {
  NOMBRE: {
    required: { value: true, message: 'El nombre de la infraestructura es obligatorio' }
  }
};

export const infraestructurasModalConfig = {
  createTitle: 'Registrar Infraestructura',
  editTitle: 'Editar Infraestructura',
  deleteTitle: '¿Eliminar infraestructura?',
  deleteMessage: (row) => `¿Estás seguro de eliminar la infraestructura "${row?.NOMBRE}"?`
};

export const infraestructurasHeaderProps = {
  headerTitle: 'Infraestructuras',
  headerDescription: 'Administra los edificios y recintos físicos del IPD'
};
