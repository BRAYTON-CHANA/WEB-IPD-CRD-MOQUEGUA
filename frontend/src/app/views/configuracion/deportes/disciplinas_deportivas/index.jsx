import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { DisciplinasDeportivasCrud } from '@/entities/disciplinas_deportivas';
import {
  disciplinasDeportivastableConfig,
  disciplinasDeportivasLevelConfigs,
  disciplinasDeportivasFormFields,
  disciplinasDeportivasMultiStep,
  disciplinasDeportivasValidation,
  disciplinasDeportivasModalConfig,
  disciplinasDeportivasHeaderProps
} from './config';

/**
 * Página de Disciplinas Deportivas con configuración local.
 *
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */
function DisciplinasDeportivosPage() {
  const config = {
    tableName: disciplinasDeportivastableConfig.tableName,
    levelConfigs: disciplinasDeportivasLevelConfigs,
    formFields: disciplinasDeportivasFormFields,
    multiStep: disciplinasDeportivasMultiStep,
    validation: disciplinasDeportivasValidation,
    modalConfig: disciplinasDeportivasModalConfig,
    headerProps: disciplinasDeportivasHeaderProps
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <DisciplinasDeportivasCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default DisciplinasDeportivosPage;
