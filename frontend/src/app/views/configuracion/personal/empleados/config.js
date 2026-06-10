/**
 * Configuración de página EMPLEADOS
 * Tabla: vw_empleados_completo (display plano) | PK: ID_EMPLEADO
 * Mutaciones: EMPLEADOS
 *
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
 */

export const empleadosTableConfig = {
  tableName: 'vw_empleados_completo'
};

export const empleadosLevelConfigs = [
  {
    level: 1,
    headers: [
      { title: 'EMPLEADO_NOMBRE_COMPLETO', label: 'Nombres Completos', type: 'string' },
      { title: 'EMPLEADO_DNI',             label: 'DNI',           type: 'string' },
      { title: 'EMPLEADO_EMAIL',           label: 'Email',         type: 'string' },
      { title: 'EMPLEADO_TELEFONO',        label: 'Teléfono',      type: 'string' },
      { title: 'UBICACION',                label: 'Ubicación',         type: 'string' },
      //{ title: 'EMPLEADO_ACTIVO',          label: 'Activo',            type: 'boolean' }
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
    maxLength: 8
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
    name: 'ID_INFRAESTRUCTURA',
    type: 'reference-select',
    label: 'Infraestructura',
    required: false,
    referenceTable: 'INFRAESTRUCTURAS',
    referenceField: 'ID_INFRAESTRUCTURA',
    referenceQuery: '{NOMBRE}',
    referenceFilters: [
      { field: 'ACTIVO', op: '=', value: true }
    ],
    ignoreField: true,
    cascadeClear: ['ID_OFICINA'],
    placeholder: 'Seleccione una infraestructura'
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
      { field: 'ACTIVO', op: '=', value: true },
      { field: 'ID_INFRAESTRUCTURA', op: '=', value: '{ID_INFRAESTRUCTURA}' }
    ],
    blocked: {
      clearOnBlock: true,
      field: 'ID_INFRAESTRUCTURA',
      op: 'empty'
    },
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
  deleteMessage: (row) => `¿Estás seguro de eliminar al empleado "${row?.EMPLEADO_NOMBRE_COMPLETO || row?.NOMBRES + ' ' + row?.APELLIDOS}"?`
};

export const empleadosHeaderProps = {
  headerTitle: 'Empleados',
  headerDescription: 'Administra el personal del IPD y su asignación a oficinas'
};
