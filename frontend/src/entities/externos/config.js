/**
 * Configuración de entidad EXTERNOS
 * Tabla: EXTERNOS | PK: ID_EXTERNO
 * Personas naturales y organizaciones externas al IPD.
 */

export const externosTableConfig = {
  tableName: 'EXTERNOS'
};

export const externosViewTableConfig = {
  tableName: 'vw_externos'
};

/**
 * Sets de headers para cada modo de vista de la tabla.
 * Usar con vw_externos (incluye campo TIPO_EXTERNO).
 */
export const externosHeaderSets = {
  todos: [
    { title: 'TIPO_EXTERNO',              label: 'Tipo',          type: 'string'  },
    { title: 'NOMBRE_O_ORGANIZACION',     label: 'Nombre / Org.', type: 'string'  },
    { title: 'APELLIDO_O_TIPO_SOCIEDAD',  label: 'Apellido / T.Soc.', type: 'string' },
    { title: 'DNI_RUC',                  label: 'DNI / RUC',     type: 'string'  },
    { title: 'TELEFONO_CONTACTO',         label: 'Teléfono',      type: 'string'  },
    { title: 'ACTIVO',                    label: 'Activo',        type: 'boolean' }
  ],
  personas: [
    { title: 'DNI_RUC',                  label: 'DNI',           type: 'string'  },
    { title: 'NOMBRE_O_ORGANIZACION',     label: 'Nombres',       type: 'string'  },
    { title: 'APELLIDO_O_TIPO_SOCIEDAD',  label: 'Apellidos',     type: 'string'  },
    { title: 'TELEFONO_CONTACTO',         label: 'Teléfono',      type: 'string'  },
    { title: 'ACTIVO',                    label: 'Activo',        type: 'boolean' }
  ],
  organizaciones: [
    { title: 'DNI_RUC',                  label: 'RUC',           type: 'string'  },
    { title: 'NOMBRE_O_ORGANIZACION',     label: 'Organización',  type: 'string'  },
    { title: 'APELLIDO_O_TIPO_SOCIEDAD',  label: 'Tipo Sociedad', type: 'string'  },
    { title: 'TELEFONO_CONTACTO',         label: 'Teléfono',      type: 'string'  },
    { title: 'ACTIVO',                    label: 'Activo',        type: 'boolean' }
  ]
};

export const externosLevelConfigs = [
  {
    level: 1,
    field: 'NOMBRE_O_ORGANIZACION',
    headers: [
      { title: 'APELLIDO_O_TIPO_SOCIEDAD', type: 'string' },
      { title: 'DNI_RUC',                 type: 'string' },
      { title: 'TELEFONO_CONTACTO',        type: 'string' },
      { title: 'ES_PERSONA_JURIDICA',      type: 'boolean' },
      { title: 'ACTIVO',                   type: 'boolean' }
    ],
    boundColumn: 'ID_EXTERNO'
  }
];

export const externosFormFields = [
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
    reverseTransform: (v) => v === true ? 'juridica' : 'natural'
  },
  {
    name: 'NOMBRE_O_ORGANIZACION',
    type: 'text',
    label: 'Nombres',
    labelWhen: [
      { condition: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }, label: 'Razón Social' }
    ],
    required: true,
    placeholder: 'Ej: Juan, Municipalidad de Moquegua'
  },
  {
    name: 'APELLIDO_O_TIPO_SOCIEDAD',
    type: 'text',
    label: 'Apellidos',
    labelWhen: [
      { condition: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }, label: 'Tipo de Sociedad' }
    ],
    required: false,
    placeholder: 'Ej: García López, S.A.C.'
  },
  {
    name: 'DNI_RUC',
    type: 'text',
    label: 'DNI',
    labelWhen: [
      { condition: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }, label: 'RUC' }
    ],
    required: false,
    placeholder: 'Ej: 12345678 o 20123456789',
    maxLength: 20
  },
  {
    name: 'TELEFONO_CONTACTO',
    type: 'text',
    label: 'Teléfono de Contacto',
    required: false,
    placeholder: 'Ej: 951234567'
  },
  {
    name: 'CORREO_CONTACTO',
    type: 'email',
    label: 'Correo de Contacto',
    required: false,
    placeholder: 'Ej: contacto@email.com'
  },
  {
    name: 'DOMICILIO_UBICACION',
    type: 'textarea',
    label: 'Domicilio / Ubicación',
    required: false,
    placeholder: 'Dirección completa...',
    rows: 2
  },
  // Campos de menores — solo visibles si ES_PERSONA_JURIDICA = false
  {
    name: 'ES_MENOR_DE_EDAD',
    type: 'boolean',
    label: 'Es Menor de Edad',
    required: false,
    defaultValue: false,
    hidden: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }
  },
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
    }
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
    }
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
    }
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
    }
  },
  // Contacto de emergencia — solo para personas naturales
  {
    name: 'EMERGENCIA_NOMBRE',
    type: 'text',
    label: 'Nombre de Contacto de Emergencia',
    required: false,
    placeholder: 'Ej: Ana López',
    hidden: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }
  },
  {
    name: 'EMERGENCIA_TELEFONO',
    type: 'text',
    label: 'Teléfono de Emergencia',
    required: false,
    placeholder: 'Ej: 951234567',
    hidden: { field: 'ES_PERSONA_JURIDICA', op: '=', value: 'juridica' }
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
