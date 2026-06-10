import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { AlmacenesCrud } from '@/entities/almacenes';
import {
  almacenesTableConfig,
  almacenesLevelConfigs,
  almacenesFormFields,
  almacenesMultiStep,
  almacenesValidation,
  almacenesModalConfig,
  almacenesHeaderProps,
  infraestructuraFormFields,
  infraestructuraValidation,
  infraestructuraModalConfig
} from './config';

/**
 * Página de Almacenes con configuración local.
 * 
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 * Ejemplo de modificaciones comunes:
 * 
 * - Cambiar título: almacenesHeaderProps.headerTitle = 'Mis Almacenes'
 * - Agregar campo: almacenesFormFields.push({ name: 'NUEVO_CAMPO', ... })
 * - Cambiar validación: almacenesValidation.NUEVO_CAMPO = { required: ... }
 */

function AlmacenesPage() {
  // Configuración local - puedes modificarla aquí o en config.js
  const config = {
    tableName: almacenesTableConfig.tableName,
    levelConfigs: almacenesLevelConfigs,
    formFields: almacenesFormFields,
    multiStep: almacenesMultiStep,
    validation: almacenesValidation,
    modalConfig: almacenesModalConfig,
    headerProps: almacenesHeaderProps,
    infraestructura: {
      formFields: infraestructuraFormFields,
      validation: infraestructuraValidation,
      modalConfig: infraestructuraModalConfig
    }
  };

  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <AlmacenesCrud config={config} />
    </LayoutWithSidebar>
  );
}

export default AlmacenesPage;
