import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { EspaciosDeportivosCrud } from '@/entities/espacios_deportivos';
import {
  espaciosDeportivosTableConfig,
  espaciosDeportivosLevelConfigs,
  espaciosDeportivosFormFields,
  espaciosDeportivosMultiStep,
  espaciosDeportivosValidation,
  espaciosDeportivosModalConfig,
  espaciosDeportivosHeaderProps,
  infraestructuraFormFields,
  infraestructuraValidation,
  infraestructuraModalConfig
} from './config';

/**
 * Página de Espacios Deportivos con configuración local.
 * 
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */

function EspaciosDeportivosPage() {
  const config = {
    tableName: espaciosDeportivosTableConfig.tableName,
    levelConfigs: espaciosDeportivosLevelConfigs,
    formFields: espaciosDeportivosFormFields,
    multiStep: espaciosDeportivosMultiStep,
    validation: espaciosDeportivosValidation,
    modalConfig: espaciosDeportivosModalConfig,
    headerProps: espaciosDeportivosHeaderProps,
    infraestructura: {
      formFields: infraestructuraFormFields,
      validation: infraestructuraValidation,
      modalConfig: infraestructuraModalConfig
    }
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <EspaciosDeportivosCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default EspaciosDeportivosPage;
