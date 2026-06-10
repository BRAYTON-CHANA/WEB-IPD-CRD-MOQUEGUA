/**
 * Configuración de entidad PROGRAMAS_DEPORTIVOS
 * Tabla: PROGRAMAS_DEPORTIVOS | PK: ID_PROGRAMA
 */

export const programasDeportivosTableConfig = {
  tableName: 'PROGRAMAS_DEPORTIVOS'
};

export const programasDeportivosLevelConfigs = [
  {
    level: 1,
    field: 'NOMBRE',
    headers: [
      { title: 'FECHA_INICIO',  type: 'date' },
      { title: 'FECHA_TERMINO', type: 'date' },
      { title: 'ACTIVO',        type: 'boolean' }
    ],
    boundColumn: 'ID_PROGRAMA'
  }
];

export const programasDeportivosFormFields = [
  {
    name: 'NOMBRE',
    type: 'text',
    label: 'Nombre del Programa',
    required: true,
    placeholder: 'Ej: Programa de Iniciación Deportiva 2025'
  },
  {
    name: 'FECHA_INICIO',
    type: 'date',
    label: 'Fecha de Inicio',
    required: true
  },
  {
    name: 'FECHA_TERMINO',
    type: 'date',
    label: 'Fecha de Término',
    required: true
  },
  {
    name: 'NOTAS',
    type: 'textarea',
    label: 'Notas',
    required: false,
    placeholder: 'Información adicional sobre el programa...',
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

export const programasDeportivosMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Programa'
};

export const programasDeportivosValidation = {
  NOMBRE: {
    required: { value: true, message: 'El nombre del programa es obligatorio' }
  },
  FECHA_INICIO: {
    required: { value: true, message: 'La fecha de inicio es obligatoria' }
  },
  FECHA_TERMINO: {
    required: { value: true, message: 'La fecha de término es obligatoria' }
  }
};

export const programasDeportivosModalConfig = {
  createTitle: 'Registrar Programa Deportivo',
  editTitle: 'Editar Programa Deportivo',
  deleteTitle: '¿Eliminar programa?',
  deleteMessage: (row) => `¿Estás seguro de eliminar el programa "${row?.NOMBRE}"?`
};

export const programasDeportivosHeaderProps = {
  headerTitle: 'Programas Deportivos',
  headerDescription: 'Administra los programas deportivos institucionales del IPD'
};
