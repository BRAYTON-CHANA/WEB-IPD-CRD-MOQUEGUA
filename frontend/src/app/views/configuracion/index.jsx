import React from 'react';
import { Link } from 'react-router-dom';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import ConfiguracionSidebar from './ConfiguracionSidebar';

function MaestrosIndexPage() {
  return (
    <LayoutWithSidebar sidebarComponent={ConfiguracionSidebar}>
      <div className="px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Datos Maestros</h1>
              <p className="text-gray-500 mt-1">Administración de catálogos y configuración base del sistema</p>
            </div>
          </div>

          <div className="prose max-w-none text-gray-600 mb-8">
            <p className="text-base leading-relaxed">
              Bienvenido al módulo de datos maestros. Desde aquí puede administrar toda la información 
              de referencia del sistema IPD, incluyendo infraestructuras, personal, disciplinas deportivas, 
              proveedores y más.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* DEPORTES */}
            <Link
              to="/configuracion/deportes/disciplinas-deportivas"
              className="group p-4 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-md flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-red-700">Disciplinas Deportivas</h3>
                  <p className="text-sm text-gray-500">Deportes y disciplinas</p>
                </div>
              </div>
            </Link>

            <Link
              to="/configuracion/deportes/programas-deportivos"
              className="group p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-md flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-700">Programas Deportivos</h3>
                  <p className="text-sm text-gray-500">Programas y eventos</p>
                </div>
              </div>
            </Link>

            <Link
              to="/configuracion/deportes/externos"
              className="group p-4 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-md flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-yellow-700">Externos</h3>
                  <p className="text-sm text-gray-500">Personas y organizaciones externas</p>
                </div>
              </div>
            </Link>

            {/* INFRAESTRUCTURAS */}
            <Link
              to="/configuracion/infraestructuras/espacios-deportivos"
              className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-700">Espacios Deportivos</h3>
                  <p className="text-sm text-gray-500">Canchas, gimnasios y recintos</p>
                </div>
              </div>
            </Link>

            {/* INVENTARIO */}
            <Link
              to="/configuracion/inventario/almacenes"
              className="group p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-md flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-amber-700">Almacenes</h3>
                  <p className="text-sm text-gray-500">Depósitos y centros de almacenamiento</p>
                </div>
              </div>
            </Link>

            <Link
              to="/configuracion/inventario/clasificacion-items"
              className="group p-4 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-md flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600">
                    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-cyan-700">Clasificación de Ítems</h3>
                  <p className="text-sm text-gray-500">Catálogo de ítems de inventario</p>
                </div>
              </div>
            </Link>

            <Link
              to="/configuracion/inventario/proveedores"
              className="group p-4 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-md flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-teal-700">Proveedores</h3>
                  <p className="text-sm text-gray-500">Empresas proveedoras</p>
                </div>
              </div>
            </Link>

            {/* PERSONAL */}
            <Link
              to="/configuracion/personal/cargos"
              className="group p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-md flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">Cargos</h3>
                  <p className="text-sm text-gray-500">Puestos institucionales</p>
                </div>
              </div>
            </Link>

            <Link
              to="/configuracion/personal/oficinas"
              className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">Oficinas</h3>
                  <p className="text-sm text-gray-500">Oficinas administrativas</p>
                </div>
              </div>
            </Link>

            <Link
              to="/configuracion/personal/empleados"
              className="group p-4 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-md flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-violet-700">Empleados</h3>
                  <p className="text-sm text-gray-500">Personal del IPD</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">
              Seleccione una categoría del menú lateral para comenzar.
            </p>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

export default MaestrosIndexPage;
