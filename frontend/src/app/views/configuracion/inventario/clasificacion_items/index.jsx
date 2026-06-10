import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { ClasificacionItemsCrud } from '@/entities/clasificacion_items';
import {
  clasificacionItemsTableConfig,
  clasificacionItemsLevelConfigs,
  clasificacionItemsFormFields,
  clasificacionItemsMultiStep,
  clasificacionItemsValidation,
  clasificacionItemsModalConfig,
  clasificacionItemsHeaderProps
} from './config';

/**
 * Página de Clasificación de Ítems con configuración local.
 *
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */

function ClasificacionItemsPage() {
  const config = {
    tableName: clasificacionItemsTableConfig.tableName,
    levelConfigs: clasificacionItemsLevelConfigs,
    formFields: clasificacionItemsFormFields,
    multiStep: clasificacionItemsMultiStep,
    validation: clasificacionItemsValidation,
    modalConfig: clasificacionItemsModalConfig,
    headerProps: clasificacionItemsHeaderProps
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <ClasificacionItemsCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default ClasificacionItemsPage;
