import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from '../../ConfiguracionSidebar';
import { InfraestructurasCrud } from '@/entities/infraestructuras';
import {
  infraestructurasHeaderProps
} from './config';

/**
 * Página de Infraestructuras con configuración local.
 * 
 * Para modificar la configuración, edita el archivo config.js en esta misma carpeta.
 */

function InfraestructurasPage() {
  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <InfraestructurasCrud
        headerOverrides={infraestructurasHeaderProps}
      />
    </LayoutWithSidebar>
  );
}

export default InfraestructurasPage;
