import React, { useState } from 'react';
import ActivoForm from '../../../activos/components/ActivoForm';

/**
 * Modal para crear activos desde el flujo de entradas
 * Modo PREVIEW: no guarda en BD, solo devuelve los datos para acumular en frontend
 */
export function ActivoFormModal({ isOpen, onClose, onSave, idAlmacenDestino }) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  if (!isOpen) return null;

  const handleSave = async ({ identidadSeleccionada, nuevaIdentidad, modoNueva, control, clasificaciones }) => {
    setSaving(true);
    setSaveError(null);
    
    try {
      // Generar ID temporal para frontend (no se guarda nada en BD aquí)
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Construir nombre completo según el modo
      let itemNombreCompleto;
      
      if (modoNueva) {
        // Buscar la descripción de la clasificación
        const clasificacion = clasificaciones?.find(c => c.ID_CLASIFICACION === nuevaIdentidad.ID_CLASIFICACION);
        const descClasificacion = clasificacion?.DESCRIPCION || '';
        const marca = nuevaIdentidad.MARCA || '';
        const modelo = nuevaIdentidad.MODELO || '';
        
        // Construir: DESCRIPCION_CLASIFICACION + MARCA + MODELO
        itemNombreCompleto = descClasificacion;
        if (marca) itemNombreCompleto += (itemNombreCompleto ? ' — ' : '') + marca;
        if (modelo) itemNombreCompleto += (itemNombreCompleto ? ' ' : '') + modelo;
        if (!itemNombreCompleto) itemNombreCompleto = 'Nuevo activo';
      } else {
        itemNombreCompleto = identidadSeleccionada?.IDENTIDAD_LABEL || 'Activo sin nombre';
      }

      // Preparar datos de identidad (sin guardar en BD aún)
      const identidadData = modoNueva ? {
        ID_CLASIFICACION: nuevaIdentidad.ID_CLASIFICACION || null,
        MARCA: nuevaIdentidad.MARCA || null,
        MODELO: nuevaIdentidad.MODELO || null,
        COLOR: nuevaIdentidad.COLOR || null,
        DIMENSIONES: nuevaIdentidad.DIMENSIONES || null,
        MATERIAL: nuevaIdentidad.MATERIAL || null,
        COMENTARIOS: nuevaIdentidad.COMENTARIOS || null,
      } : {
        ID_ACTIVO_IDENTIDAD: identidadSeleccionada.ID_ACTIVO_IDENTIDAD,
        ID_CLASIFICACION: identidadSeleccionada.ID_CLASIFICACION,
        MARCA: identidadSeleccionada.MARCA,
        MODELO: identidadSeleccionada.MODELO,
      };

      // Preparar datos de control (sin guardar en BD aún)
      const controlData = {
        COD_PATRIMONIAL: control.COD_PATRIMONIAL || null,
        NUMERO_SERIAL: control.NUMERO_SERIAL || null,
        ES_ACTIVO_FIJO: control.ES_ACTIVO_FIJO ?? true,
        ESTADO: control.ESTADO || 'Regular',
        CANTIDAD: control.CANTIDAD ?? 1,
        PESO_KG: control.PESO_KG || null,
        OBSERVACIONES: control.OBSERVACIONES || null,
        DESCRIPCION: control.DESCRIPCION || null,
        ID_GRUPO: control.ID_GRUPO || null,
        ID_ALMACEN_ASIGNADO: idAlmacenDestino || null,
      };

      // Retornar datos completos para acumular en frontend
      onSave({
        tempId,
        modoNueva,
        identidad: identidadData,
        control: controlData,
        ITEM_NOMBRE_COMPLETO: itemNombreCompleto,
        CODIGOS_COMBINADOS: control.COD_PATRIMONIAL || control.NUMERO_SERIAL || 'S/C',
      });
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <ActivoForm
          activo={null}
          onSave={handleSave}
          onCancel={onClose}
          saving={saving}
          almacenPreseleccionado={idAlmacenDestino}
          almacenBloqueado={true}
        />
        {saveError && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200 text-red-600 text-sm">
            Error: {saveError}
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivoFormModal;
