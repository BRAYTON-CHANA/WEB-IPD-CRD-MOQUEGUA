import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { EmpleadosCrud } from '@/entities/empleados';
import {
  empleadosTableConfig,
  empleadosLevelConfigs,
  empleadosFormFields,
  empleadosMultiStep,
  empleadosValidation,
  empleadosModalConfig,
  empleadosHeaderProps
} from './config';

/**
 * Página de Empleados con configuración local.
 *
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */

function EmpleadosPage() {
  const config = {
    tableName: empleadosTableConfig.tableName,
    levelConfigs: empleadosLevelConfigs,
    formFields: empleadosFormFields,
    multiStep: empleadosMultiStep,
    validation: empleadosValidation,
    modalConfig: empleadosModalConfig,
    headerProps: empleadosHeaderProps
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <EmpleadosCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default EmpleadosPage;
