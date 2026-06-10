/**
 * Configuración de página DISCIPLINAS_DEPORTIVAS
 * Tabla: DISCIPLINAS_DEPORTIVAS | PK: ID_DISCIPLINA
 *
 * Esta configuración es específica para la página y puede modificarse
 * sin afectar la configuración por defecto de entities.
 */

export const disciplinasDeportivastableConfig = {
  tableName: 'DISCIPLINAS_DEPORTIVAS'
};

export const disciplinasDeportivasLevelConfigs = [
  {
    level: 1,
    field: 'NOMBRE',
    headers: [
      { title: 'DESCRIPCION', type: 'string' },
      { title: 'ACTIVO',      type: 'boolean' }
    ],
    boundColumn: 'ID_DISCIPLINA'
  }
];

export const disciplinasDeportivasFormFields = [
  {
    name: 'NOMBRE',
    type: 'text',
    label: 'Nombre de la Disciplina',
    required: true,
    placeholder: 'Ej: Fútbol, Natación, Atletismo'
  },
  {
    name: 'DESCRIPCION',
    type: 'textarea',
    label: 'Descripción',
    required: false,
    placeholder: 'Descripción de la disciplina deportiva...',
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

export const disciplinasDeportivasMultiStep = {
  showDots: true,
  persistData: false,
  nextText: 'Siguiente',
  prevText: 'Atrás',
  submitText: 'Guardar Disciplina'
};

export const disciplinasDeportivasValidation = {
  NOMBRE: {
    required: { value: true, message: 'El nombre de la disciplina es obligatorio' }
  }
};

export const disciplinasDeportivasModalConfig = {
  createTitle: 'Registrar Disciplina Deportiva',
  editTitle: 'Editar Disciplina Deportiva',
  deleteTitle: '¿Eliminar disciplina?',
  deleteMessage: (row) => `¿Estás seguro de eliminar la disciplina "${row?.NOMBRE}"?`
};

export const disciplinasDeportivasHeaderProps = {
  headerTitle: 'Disciplinas Deportivas',
  headerDescription: 'Administra el catálogo de disciplinas deportivas del IPD'
};
