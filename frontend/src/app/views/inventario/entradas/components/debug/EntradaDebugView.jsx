import React from 'react';

export function EntradaDebugView({ cabecera, lineas, isOpen, onClose }) {
  if (!isOpen) return null;

  const formatJSON = (obj) => JSON.stringify(obj, null, 2);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl max-w-5xl max-h-[90vh] overflow-auto mx-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Inspector de Datos (DEBUG)</h2>
            <p className="text-xs text-gray-500">Vista previa de lo que se subirá a la base de datos</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* SECCIÓN 1: ENTRADA */}
          <div className="border border-blue-200 rounded-lg overflow-hidden">
            <div className="bg-blue-50 px-4 py-2 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-700">PASO 1: ENTRADA</span>
                <span className="text-xs text-blue-500">→ Tabla: ENTRADAS</span>
              </div>
            </div>
            <div className="p-4 bg-white">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(cabecera).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100 last:border-0">
                      <td className="py-1.5 pr-4 text-gray-500 font-mono text-xs w-1/3">{key}</td>
                      <td className="py-1.5 text-gray-900">
                        {value === null ? (
                          <span className="text-gray-400 italic">null</span>
                        ) : typeof value === 'boolean' ? (
                          <span className={value ? 'text-green-600' : 'text-red-600'}>{value.toString()}</span>
                        ) : (
                          String(value)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECCIÓN 2: ACTIVOS */}
          <div className="border border-green-200 rounded-lg overflow-hidden">
            <div className="bg-green-50 px-4 py-2 border-b border-green-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-green-700">PASO 2-3: ACTIVOS</span>
                <span className="text-xs text-green-500">→ Tablas: ACTIVOS_IDENTIDAD → ACTIVOS_CONTROL → ENTRADAS_ACTIVO</span>
              </div>
            </div>
            <div className="p-4 bg-white space-y-4">
              {lineas.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No hay activos en esta entrada</p>
              ) : (
                lineas.map((linea, index) => (
                  <div key={linea.tempId || index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Activo #{index + 1}: {linea.ITEM_NOMBRE_COMPLETO}</span>
                    </div>
                    <div className="p-3 space-y-3">
                      {/* Paso 2.1: Identidad */}
                      <div className="pl-3 border-l-2 border-indigo-300">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-indigo-600">PASO 2.1: IDENTIDAD</span>
                          <span className="text-xs text-gray-400">→ Tabla: ACTIVOS_IDENTIDAD</span>
                          {linea.modoNueva && (
                            <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">NUEVA</span>
                          )}
                        </div>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {formatJSON(linea.identidad)}
                        </pre>
                      </div>

                      {/* Paso 2.2: Control */}
                      <div className="pl-3 border-l-2 border-purple-300">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-purple-600">PASO 2.2: CONTROL</span>
                          <span className="text-xs text-gray-400">→ Tabla: ACTIVOS_CONTROL</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            CONFIRMADO=false (por ahora)
                          </span>
                        </div>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {formatJSON({
                            ...linea.control,
                            ID_ACTIVO_IDENTIDAD: linea.modoNueva ? '(desde paso 2.1)' : linea.identidad.ID_ACTIVO_IDENTIDAD,
                            CONFIRMADO: false,
                            ID_ENTRADA_ACTIVO_ORIGEN: null,
                            ID_ALMACEN_ASIGNADO: null
                          })}
                        </pre>
                      </div>

                      {/* Paso 3: Línea */}
                      <div className="pl-3 border-l-2 border-orange-300">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-orange-600">PASO 3: LÍNEA</span>
                          <span className="text-xs text-gray-400">→ Tabla: ENTRADAS_ACTIVO</span>
                        </div>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {formatJSON({
                            ID_ENTRADA: '(desde paso 1)',
                            ID_ACTIVO_CONTROL: '(desde paso 2.2)',
                            CANTIDAD: linea.CANTIDAD,
                            PRECIO_UNITARIO: linea.PRECIO_UNITARIO,
                            ESTADO_CONSERVADO: linea.ESTADO_CONSERVADO,
                            OBSERVACIONES: linea.OBSERVACIONES,
                            ACTIVO: true
                          })}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECCIÓN 3: JSON COMPLETO */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <span className="text-sm font-bold text-gray-700">JSON COMPLETO (onSave)</span>
            </div>
            <div className="p-4 bg-gray-50">
              <pre className="text-xs overflow-x-auto">
                {formatJSON({ cabecera, lineas })}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
