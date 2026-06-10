/**
 * Configuración de entidad EMPLEADOS
 * Tabla: EMPLEADOS | PK: ID_EMPLEADO
 */

export const empleadosTableConfig = {
  tableName: 'EMPLEADOS'
};

export const empleadosLevelConfigs = [
  {
    level: 1,
    field: 'DNI',
    headers: [
      { title: 'NOMBRES',      type: 'string' },
      { title: 'APELLIDOS',    type: 'string' },
      { title: 'NOMBRE_ABREV', type: 'string' },
      { title: 'EMAIL',        type: 'string' },
      { title: 'TELEFONO',     type: 'string' },
      { title: 'ACTIVO',       type: 'boolean' }
    ],
    boundColumn: 'ID_EMPLEADO'
  }
];

export const empleadosFormFields = [
  {
    name: 'DNI',
    type: 'text',
    label: 'DNI',
    required: true,
    placeholder: 'Ej: 12345678',
    maxLength: 20
  },
  {
    name: 'NOMBRES',
    type: 'text',
    label: 'Nombres',
    required: true,
    placeholder: 'Ej: Juan Carlos'
  },
  {
    name: 'APELLIDOS',
    type: 'text',
    label: 'Apellidos',
    required: true,
    placeholder: 'Ej: García López'
  },
  {
    name: 'NOMBRE_ABREV',
    type: 'text',
    label: 'Nombre Abreviado',
    required: false,
    placeholder: 'Ej: J. García'
  },
  {
    name: 'ID_CARGO',
    type: 'reference-select',
    label: 'Cargo',
    required: false,
    referenceTable: 'CARGOS',
    referenceField: 'ID_CARGO',
    referenceQuery: '{NOMBRE_CARGO}',
    referenceFilters: [
      { field: 'ACTIVO', op: '=', value: true }
    ],
    placeholder: 'Seleccione un cargo'
  },
  {
    name: 'ID_OFICINA',
    type: 'reference-select',
    label: 'Oficina',
    required: false,
    referenceTable: 'OFICINAS',
    referenceField: 'ID_OFICINA',
    referenceQuery: '{NOMBRE_OFICINA}',
    referenceFilters: [
      { field: 'ACTIVO', op: '=', value: true }
    ],
    placeholder: 'Seleccione una oficina'
  },
  {
    name: 'EMAIL',
    type: 'email',
    label: 'Correo Electrónico',
    required: false,
    placeholder: 'Ej: jgarcia@ipd.gob.pe'
  },
  {
    name: 'TELEFONO',
    type: 'text',
    label: 'Teléfono',
    required: false,
    placeholder: 'Ej: 951234567'
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

export const empleadosMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Empleado'
};

export const empleadosValidation = {
  DNI: {
    required: { value: true, message: 'El DNI es obligatorio' }
  },
  NOMBRES: {
    required: { value: true, message: 'Los nombres son obligatorios' }
  },
  APELLIDOS: {
    required: { value: true, message: 'Los apellidos son obligatorios' }
  }
};

export const empleadosModalConfig = {
  createTitle: 'Registrar Empleado',
  editTitle: 'Editar Empleado',
  deleteTitle: '¿Eliminar empleado?',
  deleteMessage: (row) => `¿Estás seguro de eliminar al empleado "${row?.NOMBRES} ${row?.APELLIDOS}"?`
};

export const empleadosHeaderProps = {
  headerTitle: 'Empleados',
  headerDescription: 'Administra el personal del IPD y su asignación a oficinas'
};
