/**
 * Configuración de página OFICINAS (3 NIVELES)
 * Nivel 1: Infraestructuras
 * Nivel 2: Oficinas
 * Nivel 3: Empleados con Cargo
 * View: vw_oficinas_por_infraestructura (3 niveles con LEFT JOINs)
 * 
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
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
      { title: 'REGION', type: 'string' }
    ],
    boundColumn: 'ID_INFRAESTRUCTURA',
    groupActions: true,
    childCountLabel: { singular: 'oficina', plural: 'oficinas' }
  },
  {
    level: 2,
    field: 'NOMBRE_OFICINA',
    headers: [
      { title: 'PISO_NIVEL', type: 'string' },
      { title: 'COMENTARIOS', type: 'string' }
    ],
    boundColumn: 'ID_OFICINA',
    childCountLabel: { singular: 'empleado', plural: 'empleados' }
  },
  {
    level: 3,
    field: 'EMPLEADO_ABREV',
    headers: [
      { title: 'EMPLEADO_NOMBRES', type: 'string' },
      { title: 'NOMBRE_CARGO', type: 'string' }
    ],
    boundColumn: 'ID_EMPLEADO'
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
  headerDescription: 'Administra oficinas y empleados agrupados por infraestructura'
};

// Configuración para CRUD de Empleados (nivel 3)
export const empleadoFormFields = [
  {
    name: 'ID_OFICINA',
    type: 'reference-select',
    label: 'Oficina',
    required: true,
    referenceTable: 'OFICINAS',
    referenceField: 'ID_OFICINA',
    referenceQuery: '{NOMBRE_OFICINA}',
    referenceFilters: [
      { field: 'ACTIVO', op: '=', value: true }
    ],
    placeholder: 'Seleccione una oficina'
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
    name: 'DNI',
    type: 'text',
    label: 'DNI',
    required: true,
    placeholder: 'Ej: 12345678'
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
    placeholder: 'Ej: Pérez García'
  },
  {
    name: 'NOMBRE_ABREV',
    type: 'text',
    label: 'Nombre Abreviado',
    required: false,
    placeholder: 'Ej: J.C. Pérez'
  },
  {
    name: 'EMAIL',
    type: 'email',
    label: 'Correo Electrónico',
    required: false,
    placeholder: 'Ej: jperez@ejemplo.com'
  },
  {
    name: 'TELEFONO',
    type: 'text',
    label: 'Teléfono',
    required: false,
    placeholder: 'Ej: 953123456'
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

export const empleadoValidation = {
  ID_OFICINA: {
    required: { value: true, message: 'Debe seleccionar una oficina' }
  },
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

export const empleadoModalConfig = {
  createTitle: 'Registrar Empleado',
  editTitle: 'Editar Empleado',
  deleteTitle: '¿Eliminar empleado?',
  deleteMessage: (row) => `¿Estás seguro de eliminar al empleado "${row?.EMPLEADO_NOMBRES} ${row?.EMPLEADO_APELLIDOS}"?`
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
  deleteMessage: (row) => `¿Estás seguro de eliminar la infraestructura "${row?.INFRAESTRUCTURA}"?`
};
