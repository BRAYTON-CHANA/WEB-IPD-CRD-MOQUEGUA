import React from 'react';
import { Routes, Route } from 'react-router-dom';
import '@/shared/theme/globals.css';

// Import pages
import Home from '@/app/views/home';
import ReservasPage   from '@/app/views/reservas';
import InventarioPage     from '@/app/views/inventario';
import ActivosPage        from '@/app/views/inventario/activos';
import EntradasPage       from '@/app/views/inventario/entradas';
import SalidasPage        from '@/app/views/inventario/salidas';
import MovimientosPage    from '@/app/views/inventario/movimientos';

// Configuracion - Index
import ConfiguracionIndexPage from '@/app/views/configuracion';

// Deportes
import DisciplinasPage       from '@/app/views/configuracion/deportes/disciplinas_deportivas';
import ProgramasPage         from '@/app/views/configuracion/deportes/programas_deportivos';
import ExternosPage          from '@/app/views/configuracion/deportes/externos';

// Infraestructuras
import InfraestructurasPage   from '@/app/views/configuracion/infraestructuras/infraestructuras';
import EspaciosDeportivosPage from '@/app/views/configuracion/infraestructuras/espacios_deportivos';

// Inventario
import AlmacenesPage         from '@/app/views/configuracion/inventario/almacenes';
import ClasificacionItemsPage from '@/app/views/configuracion/inventario/clasificacion_items';
import ProveedoresPage       from '@/app/views/configuracion/inventario/proveedores';

// Personal
import CargosPage            from '@/app/views/configuracion/personal/cargos';
import OficinasPage          from '@/app/views/configuracion/personal/oficinas';
import EmpleadosPage         from '@/app/views/configuracion/personal/empleados';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reservas" element={<ReservasPage />} />
      <Route path="/inventario" element={<InventarioPage />} />
      <Route path="/inventario/activos"     element={<ActivosPage />} />
      <Route path="/inventario/entradas"    element={<EntradasPage />} />
      <Route path="/inventario/salidas"     element={<SalidasPage />} />
      <Route path="/inventario/movimientos" element={<MovimientosPage />} />

      {/* Configuracion */}
      <Route path="/configuracion" element={<ConfiguracionIndexPage />} />

      {/* Deportes */}
      <Route path="/configuracion/deportes/disciplinas-deportivas" element={<DisciplinasPage />} />
      <Route path="/configuracion/deportes/programas-deportivos" element={<ProgramasPage />} />
      <Route path="/configuracion/deportes/externos"             element={<ExternosPage />} />

      {/* Infraestructuras */}
      <Route path="/configuracion/infraestructuras"                    element={<InfraestructurasPage />} />
      <Route path="/configuracion/infraestructuras/espacios-deportivos" element={<EspaciosDeportivosPage />} />

      {/* Inventario */}
      <Route path="/configuracion/inventario/almacenes"           element={<AlmacenesPage />} />
      <Route path="/configuracion/inventario/clasificacion-items" element={<ClasificacionItemsPage />} />
      <Route path="/configuracion/inventario/proveedores"       element={<ProveedoresPage />} />

      {/* Personal */}
      <Route path="/configuracion/personal/cargos"    element={<CargosPage />} />
      <Route path="/configuracion/personal/oficinas"  element={<OficinasPage />} />
      <Route path="/configuracion/personal/empleados" element={<EmpleadosPage />} />
    </Routes>
  );
}

export default App;
