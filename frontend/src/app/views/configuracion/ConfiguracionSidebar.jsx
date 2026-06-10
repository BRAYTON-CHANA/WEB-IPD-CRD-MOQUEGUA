import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SidebarMenu from '@/shared/components/layout/SidebarMenu';

const items = [
  {
    id: 'infraestructuras',
    name: 'Infraestructuras',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    children: [
      {
        id: 'infraestructuras_lista',
        name: 'Infraestructuras',
        href: '/configuracion/infraestructuras',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
          </svg>
        )
      },
      {
        id: 'espacios_deportivos',
        name: 'Espacios Deportivos',
        href: '/configuracion/infraestructuras/espacios-deportivos',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
          </svg>
        )
      }
    ]
  },
  {
    id: 'personal',
    name: 'Personal',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    children: [
      
      {
        id: 'empleados',
        name: 'Empleados',
        href: '/configuracion/personal/empleados',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        )
      },
      {
        id: 'cargos',
        name: 'Cargos',
        href: '/configuracion/personal/cargos',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        )
      },
      {
        id: 'oficinas',
        name: 'Oficinas',
        href: '/configuracion/personal/oficinas',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        )
      }
    ]
  },
  {
    id: 'deportes',
    name: 'Deportes',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    children: [
      {
        id: 'disciplinas',
        name: 'Disciplinas Deportivas',
        href: '/configuracion/deportes/disciplinas-deportivas',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        )
      },
      {
        id: 'programas',
        name: 'Programas Deportivos',
        href: '/configuracion/deportes/programas-deportivos',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        )
      },
      {
        id: 'externos',
        name: 'Externos',
        href: '/configuracion/deportes/externos',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        )
      }
    ]
  },
  
  {
    id: 'inventario',
    name: 'Inventario',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    children: [
      {
        id: 'almacenes',
        name: 'Almacenes',
        href: '/configuracion/inventario/almacenes',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        )
      },
      {
        id: 'clasificacion',
        name: 'Clasificación de Ítems',
        href: '/configuracion/inventario/clasificacion-items',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        )
      },
      {
        id: 'proveedores',
        name: 'Proveedores',
        href: '/configuracion/inventario/proveedores',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        )
      }
    ]
  }
  
];

function ConfiguracionSidebar() {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  // Función recursiva para marcar items activos
  const processItems = (menuItems) => {
    return menuItems.map(item => {
      const isActive = location.pathname === item.href;
      
      const newItem = {
        ...item,
        active: isActive,
      };
      
      if (item.children) {
        newItem.children = processItems(item.children);
      }
      
      return newItem;
    });
  };

  const itemsWithActive = processItems(items);

  const handleToggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Auto-expandir grupos si algún sub-item está activo
  useEffect(() => {
    const newExpanded = { ...expandedMenus };
    let hasChanges = false;

    items.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(
          child => location.pathname === child.href
        );
        if (hasActiveChild && !expandedMenus[item.id]) {
          newExpanded[item.id] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setExpandedMenus(newExpanded);
    }
  }, [location.pathname]);

  return (
    <SidebarMenu
      items={itemsWithActive}
      className="h-full bg-white border-r border-gray-200 w-56 py-4"
      expandable={true}
      expandedMenus={expandedMenus}
      onToggleMenu={handleToggleMenu}
      header={
        <Link to="/configuracion" className="block px-4 pb-1 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Datos</p>
        </Link>
      }
    />
  );
}

export default ConfiguracionSidebar;
