/**
 * Configuración de página PROVEEDORES
 * Tabla: PROVEEDORES | PK: ID_PROVEEDOR
 *
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
 */

export const proveedoresTableConfig = {
  tableName: 'PROVEEDORES'
};

export const proveedoresLevelConfigs = [
  {
    level: 1,
    field: 'NOMBRE_PROVEEDOR',
    headers: [
      { title: 'RUC',             type: 'string' },
      { title: 'CONTACTO_NOMBRE', type: 'string' },
      { title: 'TELEFONO',        type: 'string' },
      { title: 'DISTRITO',        type: 'string' },
      { title: 'ACTIVO',          type: 'boolean' }
    ],
    boundColumn: 'ID_PROVEEDOR'
  }
];

export const proveedoresFormFields = [
  {
    name: 'NOMBRE_PROVEEDOR',
    type: 'text',
    label: 'Nombre del Proveedor',
    required: true,
    placeholder: 'Ej: Distribuidora Deportiva SAC'
  },
  {
    name: 'RUC',
    type: 'text',
    label: 'RUC',
    required: false,
    placeholder: 'Ej: 20123456789',
    maxLength: 11
  },
  {
    name: 'CONTACTO_NOMBRE',
    type: 'text',
    label: 'Nombre del Contacto',
    required: false,
    placeholder: 'Ej: Juan Pérez'
  },
  {
    name: 'TELEFONO',
    type: 'text',
    label: 'Teléfono',
    required: false,
    placeholder: 'Ej: 951234567'
  },
  {
    name: 'EMAIL',
    type: 'email',
    label: 'Correo Electrónico',
    required: false,
    placeholder: 'Ej: ventas@proveedor.com'
  },
  {
    name: 'DIRECCION',
    type: 'text',
    label: 'Dirección',
    required: false,
    placeholder: 'Ej: Av. Industrial 456'
  },
  {
    name: 'DISTRITO',
    type: 'text',
    label: 'Distrito',
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
    name: 'REGION',
    type: 'text',
    label: 'Región',
    required: false,
    placeholder: 'Ej: Moquegua'
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

export const proveedoresMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Proveedor'
};

export const proveedoresValidation = {
  NOMBRE_PROVEEDOR: {
    required: { value: true, message: 'El nombre del proveedor es obligatorio' }
  },
  RUC: {
    pattern: {
      value: /^\d{11}$/,
      message: 'El RUC debe tener exactamente 11 dígitos'
    }
  }
};

export const proveedoresModalConfig = {
  createTitle: 'Registrar Proveedor',
  editTitle: 'Editar Proveedor',
  deleteTitle: '¿Eliminar proveedor?',
  deleteMessage: (row) => `¿Estás seguro de eliminar al proveedor "${row?.NOMBRE_PROVEEDOR}"?`
};

export const proveedoresHeaderProps = {
  headerTitle: 'Proveedores',
  headerDescription: 'Administra los proveedores de activos e insumos del IPD'
};
