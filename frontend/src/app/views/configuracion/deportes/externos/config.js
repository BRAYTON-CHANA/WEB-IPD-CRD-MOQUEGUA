/**
 * Configuración de página EXTERNOS
 * Tabla: EXTERNOS | PK: ID_EXTERNO
 * Personas naturales y organizaciones externas al IPD.
 *
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
 */

export const externosTableConfig = {
  tableName: 'vw_externos'
};

export const externosLevelConfigs = [
  {
    level: 1,
    field: 'DNI_RUC',
    fieldLabel: 'DNI / RUC',
    headers: [
      { title: 'NOMBRE_O_ORGANIZACION', type: 'string',  label: 'Nombre' },
      { title: 'APELLIDO_O_TIPO_SOCIEDAD', type: 'string',  label: 'Apellido / Sociedad' },
      { title: 'TELEFONO_CONTACTO',        type: 'string',  label: 'Teléfono' },
      { title: 'ES_PERSONA_JURIDICA',      type: 'boolean', label: 'Tipo', valueMap: { true: 'Organización', false: 'Persona Natural' } },
      { title: 'ACTIVO',                   type: 'boolean', label: 'Activo' }
    ],
    boundColumn: 'ID_EXTERNO'
  }
];

export const externosFormFields = [
  // --- Página 1, Sección 1: Tipo de Externo (full width) ---
  {
    name: 'ES_PERSONA_JURIDICA',
    type: 'select',
    label: 'Tipo de Externo',
    required: true,
    defaultValue: 'natural',
    options: [
      { value: 'natural',  label: 'Persona Natural' },
      { value: 'juridica', label: 'Organización / Empresa' }
    ],
    transform: (v) => v === 'juridica',
    reverseTransform: (v) => v === true ? 'juridica' : 'natural',
    page: 1, section: 1
  },
  // --- Página 1, Sección 2: Identidad (2 columnas) ---
  {
    name: 'DNI_RUC',
    type: 'text',
    label: 'DNI',
    labelWhen: [
      { condition: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }, label: 'RUC' }
    ],
    required: false,
    placeholder: 'Ej: 12345678 o 20123456789',
    maxLength: 20,
    page: 1, section: 2
  },
  {
    name: 'NOMBRE_O_ORGANIZACION',
    type: 'text',
    label: 'Nombres',
    labelWhen: [
      { condition: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }, label: 'Nombre organizacion' }
    ],
    required: true,
    placeholder: 'Ej: Juan, Municipalidad de Moquegua',
    page: 1, section: 2
  },
  {
    name: 'APELLIDO_O_TIPO_SOCIEDAD',
    type: 'text',
    label: 'Apellidos',
    labelWhen: [
      { condition: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }, label: 'Tipo de Sociedad' }
    ],
    required: false,
    placeholder: 'Ej: García López, S.A.C.',
    page: 1, section: 2
  },
  
  // --- Página 1, Sección 3: Contacto (2 columnas) ---
  {
    name: 'TELEFONO_CONTACTO',
    type: 'text',
    label: 'Teléfono de Contacto',
    required: false,
    placeholder: 'Ej: 951234567',
    page: 1, section: 3
  },
  {
    name: 'CORREO_CONTACTO',
    type: 'email',
    label: 'Correo de Contacto',
    required: false,
    placeholder: 'Ej: contacto@email.com',
    page: 1, section: 3
  },
  {
    name: 'DOMICILIO_UBICACION',
    type: 'textarea',
    label: 'Domicilio / Ubicación',
    required: false,
    placeholder: 'Dirección completa...',
    rows: 2,
    page: 1, section: 3
  },
  // --- Página 2, Sección 1: Menor de Edad ---
  {
    name: 'ES_MENOR_DE_EDAD',
    type: 'boolean',
    label: 'Es Menor de Edad',
    required: false,
    defaultValue: false,
    hidden: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' },
    page: 2, section: 1
  },
  // --- Página 2, Sección 2: Datos del Tutor (2 columnas) ---
  {
    name: 'TUTOR_NOMBRE_COMPLETO',
    type: 'text',
    label: 'Nombre Completo del Tutor',
    required: false,
    placeholder: 'Ej: María García',
    hidden: {
      or: [
        { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' },
        { field: 'ES_MENOR_DE_EDAD',    op: '=', value: false }
      ]
    },
    page: 2, section: 2
  },
  {
    name: 'TUTOR_DNI',
    type: 'text',
    label: 'DNI del Tutor',
    required: false,
    placeholder: 'Ej: 12345678',
    hidden: {
      or: [
        { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' },
        { field: 'ES_MENOR_DE_EDAD',    op: '=', value: false }
      ]
    },
    page: 2, section: 2
  },
  {
    name: 'TUTOR_TELEFONO',
    type: 'text',
    label: 'Teléfono del Tutor',
    required: false,
    placeholder: 'Ej: 951234567',
    hidden: {
      or: [
        { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' },
        { field: 'ES_MENOR_DE_EDAD',    op: '=', value: false }
      ]
    },
    page: 2, section: 2
  },
  {
    name: 'TUTOR_PARENTESCO',
    type: 'text',
    label: 'Parentesco del Tutor',
    required: false,
    placeholder: 'Ej: Padre, Madre, Apoderado',
    hidden: {
      or: [
        { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' },
        { field: 'ES_MENOR_DE_EDAD',    op: '=', value: false }
      ]
    },
    page: 2, section: 2
  },
  // --- Página 2, Sección 3: Emergencia (2 columnas) ---
  {
    name: 'EMERGENCIA_NOMBRE',
    type: 'text',
    label: 'Nombre de Contacto de Emergencia',
    required: false,
    placeholder: 'Ej: Ana López',
    hidden: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' },
    page: 2, section: 3
  },
  {
    name: 'EMERGENCIA_TELEFONO',
    type: 'text',
    label: 'Teléfono de Emergencia',
    required: false,
    placeholder: 'Ej: 951234567',
    hidden: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' },
    page: 2, section: 3
  },
  // --- Página 2, Sección 4: Observaciones (2 columnas) ---
  {
    name: 'COMENTARIOS',
    type: 'textarea',
    label: 'Comentarios',
    required: false,
    placeholder: 'Observaciones adicionales...',
    rows: 2,
    page: 2, section: 4
  },
  {
    name: 'ACTIVO',
    type: 'boolean',
    label: 'Activo',
    required: false,
    defaultValue: true,
    page: 2, section: 4
  }
];

export const externosFormLayout = {
  type: 'multistep',
  pages: [
    {
      id: 'page-datos-principales',
      title: 'Datos Principales',
      sections: [
        { id: 'sec-tipo',      title: '',  columns: 1 },
        { id: 'sec-identidad', title: 'Identidad',         columns: 2 },
        { id: 'sec-contacto',  title: 'Contacto',          columns: 2 }
      ]
    },
    {
      id: 'page-datos-adicionales',
      title: 'Datos Adicionales',
      sections: [
        { id: 'sec-menor',     title: 'Minoría de Edad',   columns: 1 },
        { id: 'sec-tutor',     title: 'Datos del Tutor',   columns: 2 },
        { id: 'sec-emergencia',title: 'Contacto de Emergencia', columns: 2 },
        { id: 'sec-otros',     title: 'Observaciones',     columns: 1 }
      ]
    }
  ]
};

export const externosMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Externo'
};

export const externosValidation = {
  NOMBRE_O_ORGANIZACION: {
    required: { value: true, message: 'El nombre o razón social es obligatorio' }
  }
};

export const externosModalConfig = {
  createTitle: 'Registrar Externo',
  editTitle: 'Editar Externo',
  deleteTitle: '¿Eliminar externo?',
  deleteMessage: (row) => `¿Estás seguro de eliminar a "${row?.NOMBRE_O_ORGANIZACION}"?`
};

export const externosHeaderProps = {
  headerTitle: 'Externos',
  headerDescription: 'Administra personas naturales y organizaciones externas al IPD'
};
