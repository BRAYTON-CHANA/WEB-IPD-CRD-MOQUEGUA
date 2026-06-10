import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { CargosCrud } from '@/entities/cargos';
import {
  cargosTableConfig,
  cargosLevelConfigs,
  cargosFormFields,
  cargosMultiStep,
  cargosValidation,
  cargosModalConfig,
  cargosHeaderProps
} from './config';

/**
 * Página de Cargos con configuración local.
 *
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */

function CargosPage() {
  const config = {
    tableName: cargosTableConfig.tableName,
    levelConfigs: cargosLevelConfigs,
    formFields: cargosFormFields,
    multiStep: cargosMultiStep,
    validation: cargosValidation,
    modalConfig: cargosModalConfig,
    headerProps: cargosHeaderProps
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <CargosCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default CargosPage;
