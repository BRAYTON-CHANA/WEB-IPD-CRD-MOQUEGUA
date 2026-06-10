import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { ProgramasDeportivosCrud } from '@/entities/programas_deportivos';
import {
  programasDeportivosTableConfig,
  programasDeportivosLevelConfigs,
  programasDeportivosFormFields,
  programasDeportivosMultiStep,
  programasDeportivosValidation,
  programasDeportivosModalConfig,
  programasDeportivosHeaderProps
} from './config';

/**
 * Página de Programas Deportivos con configuración local.
 *
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */
function ProgramasDeportivosPage() {
  const config = {
    tableName: programasDeportivosTableConfig.tableName,
    levelConfigs: programasDeportivosLevelConfigs,
    formFields: programasDeportivosFormFields,
    multiStep: programasDeportivosMultiStep,
    validation: programasDeportivosValidation,
    modalConfig: programasDeportivosModalConfig,
    headerProps: programasDeportivosHeaderProps
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <ProgramasDeportivosCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default ProgramasDeportivosPage;
