import React from 'react';
import { Link } from 'react-router-dom';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import InventarioSidebar from './InventarioSidebar';

const CARDS = [
  {
    to: '/inventario/activos',
    title: 'Activos',
    desc: 'Control patrimonial de activos fijos y consumibles',
    color: 'blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    to: '/inventario/entradas',
    title: 'Entradas',
    desc: 'Ingresos al patrimonio por compra o donación',
    color: 'green',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
      </svg>
    ),
  },
  {
    to: '/inventario/salidas',
    title: 'Salidas',
    desc: 'Egresos del patrimonio por donación o baja',
    color: 'red',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
      </svg>
    ),
  },
  {
    to: '/inventario/movimientos',
    title: 'Movimientos',
    desc: 'Traslados internos y préstamos de activos',
    color: 'amber',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 9l4-4 4 4"/><path d="M9 5v14"/><path d="M19 15l-4 4-4-4"/><path d="M15 19V5"/>
      </svg>
    ),
  },
];

const colorMap = {
  blue:  { bg: 'bg-blue-100',  hover: 'hover:border-blue-300 hover:bg-blue-50/50',  icon: 'text-blue-600',  title: 'group-hover:text-blue-700',  hoverBg: 'group-hover:bg-blue-200'  },
  green: { bg: 'bg-green-100', hover: 'hover:border-green-300 hover:bg-green-50/50', icon: 'text-green-600', title: 'group-hover:text-green-700', hoverBg: 'group-hover:bg-green-200' },
  red:   { bg: 'bg-red-100',   hover: 'hover:border-red-300 hover:bg-red-50/50',     icon: 'text-red-600',   title: 'group-hover:text-red-700',   hoverBg: 'group-hover:bg-red-200'   },
  amber: { bg: 'bg-amber-100', hover: 'hover:border-amber-300 hover:bg-amber-50/50', icon: 'text-amber-600', title: 'group-hover:text-amber-700', hoverBg: 'group-hover:bg-amber-200' },
};

function InventarioPage() {
  return (
    <LayoutWithSidebar sidebarComponent={InventarioSidebar}>
      <div className="px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
              <p className="text-gray-500 mt-1">Control de activos, entradas, salidas y movimientos patrimoniales</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CARDS.map(card => {
              const c = colorMap[card.color];
              return (
                <Link
                  key={card.to}
                  to={card.to}
                  className={`group p-4 rounded-lg border border-gray-200 ${c.hover} transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${c.bg} rounded-md flex items-center justify-center ${c.hoverBg} transition-colors`}>
                      <span className={c.icon}>{card.icon}</span>
                    </div>
                    <div>
                      <h3 className={`font-semibold text-gray-900 ${c.title}`}>{card.title}</h3>
                      <p className="text-sm text-gray-500">{card.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400">Seleccione una sección del menú lateral para comenzar.</p>
          </div>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

export default InventarioPage;
