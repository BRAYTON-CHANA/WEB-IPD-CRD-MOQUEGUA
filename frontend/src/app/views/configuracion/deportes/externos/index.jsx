import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { ExternosCrud } from '@/entities/externos';
import {
  externosTableConfig,
  externosLevelConfigs,
  externosFormFields,
  externosFormLayout,
  externosMultiStep,
  externosValidation,
  externosModalConfig,
  externosHeaderProps
} from './config';

/**
 * Página de Externos con configuración local.
 *
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */
function ExternosPage() {
  const config = {
    tableName: externosTableConfig.tableName,
    levelConfigs: externosLevelConfigs,
    formFields: externosFormFields,
    formLayout: externosFormLayout,
    multiStep: externosMultiStep,
    validation: externosValidation,
    modalConfig: externosModalConfig,
    headerProps: externosHeaderProps
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <ExternosCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default ExternosPage;
