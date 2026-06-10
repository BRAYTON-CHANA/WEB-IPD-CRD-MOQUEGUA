import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { OficinasCrud } from '@/entities/oficinas';
import {
  oficinasTableConfig,
  oficinasLevelConfigs,
  oficinasFormFields,
  oficinasMultiStep,
  oficinasValidation,
  oficinasModalConfig,
  oficinasHeaderProps,
  infraestructuraFormFields,
  infraestructuraValidation,
  infraestructuraModalConfig,
  empleadoFormFields,
  empleadoValidation,
  empleadoModalConfig
} from './config';

/**
 * Página de Oficinas (3 NIVELES) con configuración local.
 * Nivel 1: Infraestructuras | Nivel 2: Oficinas | Nivel 3: Empleados
 * 
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */

function OficinasPage() {
  const config = {
    tableName: oficinasTableConfig.tableName,
    levelConfigs: oficinasLevelConfigs,
    formFields: oficinasFormFields,
    multiStep: oficinasMultiStep,
    validation: oficinasValidation,
    modalConfig: oficinasModalConfig,
    headerProps: oficinasHeaderProps,
    infraestructura: {
      formFields: infraestructuraFormFields,
      validation: infraestructuraValidation,
      modalConfig: infraestructuraModalConfig
    },
    empleado: {
      formFields: empleadoFormFields,
      validation: empleadoValidation,
      modalConfig: empleadoModalConfig
    }
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <OficinasCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default OficinasPage;
