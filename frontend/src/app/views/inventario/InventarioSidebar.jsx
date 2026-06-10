import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SidebarMenu from '@/shared/components/layout/SidebarMenu';

const items = [
  {
    id: 'activos',
    name: 'Activos',
    href: '/inventario/activos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    id: 'entradas',
    name: 'Entradas',
    href: '/inventario/entradas',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
      </svg>
    ),
  },
  {
    id: 'salidas',
    name: 'Salidas',
    href: '/inventario/salidas',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
      </svg>
    ),
  },
  {
    id: 'movimientos',
    name: 'Movimientos',
    href: '/inventario/movimientos',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9l4-4 4 4"/><path d="M9 5v14"/><path d="M19 15l-4 4-4-4"/><path d="M15 19V5"/>
      </svg>
    ),
  },
];

function InventarioSidebar() {
  const location = useLocation();

  const processItems = (menuItems) =>
    menuItems.map(item => ({
      ...item,
      active: location.pathname === item.href,
    }));

  const itemsWithActive = processItems(items);

  return (
    <SidebarMenu
      items={itemsWithActive}
      className="h-full bg-white border-r border-gray-200 w-56 py-4"
      header={
        <Link to="/inventario" className="block px-4 pb-1 border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inventario</p>
        </Link>
      }
    />
  );
}

export default InventarioSidebar;
