import React, { useState } from 'react';
import { db } from '@/shared/api';
import { Label } from '../ui/FormFields';
import { UniqueSelect } from '../ui/UniqueSelect';

export function ClasificacionModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ DESCRIPCION: '', CODIGO: '', CATEGORIA: '', UNIDAD_MEDIDA: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleGuardar = async () => {
    if (!form.DESCRIPCION.trim()) { setError('La descripción es obligatoria'); return; }
    setSaving(true);
    setError(null);
    try {
      const created = await db.insert('CLASIFICACION_ITEMS', {
        DESCRIPCION:   form.DESCRIPCION.trim() || null,
        CODIGO:        form.CODIGO.trim()     || null,
        CATEGORIA:     form.CATEGORIA         || null,
        UNIDAD_MEDIDA: form.UNIDAD_MEDIDA     || null,
        ACTIVO:        true,
      });
      const nuevo = Array.isArray(created) ? created[0] : created;
      onCreated(nuevo);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Nueva Clasificación</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          <div>
            <Label required>Descripción</Label>
            <input value={form.DESCRIPCION} onChange={e => set('DESCRIPCION', e.target.value)} placeholder="Ej: Silla, Escritorio, Pelota..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <Label>Código</Label>
            <input value={form.CODIGO} onChange={e => set('CODIGO', e.target.value)} placeholder="Ej: MOB-001" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <UniqueSelect label="Categoría" tableName="CLASIFICACION_ITEMS" columnName="CATEGORIA" value={form.CATEGORIA} onChange={v => set('CATEGORIA', v)} placeholder="Sin categoría" />
          <UniqueSelect label="Unidad de medida" tableName="CLASIFICACION_ITEMS" columnName="UNIDAD_MEDIDA" value={form.UNIDAD_MEDIDA} onChange={v => set('UNIDAD_MEDIDA', v)} placeholder="Sin unidad" />
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100 bg-gray-50">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">Cancelar</button>
          <button type="button" onClick={handleGuardar} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
