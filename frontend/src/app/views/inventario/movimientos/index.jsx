import React from 'react';
import LayoutWithSidebar from '@/shared/components/layout/LayoutWithSidebar';
import InventarioSidebar from '../InventarioSidebar';

function MovimientosPage() {
  return (
    <LayoutWithSidebar sidebarComponent={InventarioSidebar}>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Movimientos</h1>
          <p className="text-gray-600 mt-1">Traslados y transferencias de activos</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 9l4-4 4 4M9 5v14M19 15l-4 4-4-4M15 19V5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Movimientos</h2>
          <p className="text-gray-400 text-sm max-w-sm">Módulo en construcción.</p>
        </div>
      </div>
    </LayoutWithSidebar>
  );
}

export default MovimientosPage;
