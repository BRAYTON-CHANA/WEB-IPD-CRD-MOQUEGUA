import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { ProveedoresCrud } from '@/entities/proveedores';
import {
  proveedoresTableConfig,
  proveedoresLevelConfigs,
  proveedoresFormFields,
  proveedoresMultiStep,
  proveedoresValidation,
  proveedoresModalConfig,
  proveedoresHeaderProps
} from './config';

/**
 * Página de Proveedores con configuración local.
 *
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */

function ProveedoresPage() {
  const config = {
    tableName: proveedoresTableConfig.tableName,
    levelConfigs: proveedoresLevelConfigs,
    formFields: proveedoresFormFields,
    multiStep: proveedoresMultiStep,
    validation: proveedoresValidation,
    modalConfig: proveedoresModalConfig,
    headerProps: proveedoresHeaderProps
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <ProveedoresCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default ProveedoresPage;
