import React, { useState } from 'react';
import { db } from '@/shared/api';
import { Label } from '../ui/FormFields';

export function GrupoModal({ onClose, onCreated, idAlmacen, nombreAlmacen }) {
  const [form, setForm] = useState({ NOMBRE: '', COD_IDENTIFICADOR_GENERAL: '', DESCRIPCION: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleGuardar = async () => {
    if (!form.NOMBRE.trim()) { setError('El nombre es obligatorio'); return; }
    if (!idAlmacen) { setError('Debe seleccionar un almacén primero'); return; }
    setSaving(true);
    setError(null);
    try {
      const created = await db.insert('GRUPOS_ACTIVOS', {
        NOMBRE:                    form.NOMBRE.trim()         || null,
        COD_IDENTIFICADOR_GENERAL: form.COD_IDENTIFICADOR_GENERAL.trim() || null,
        DESCRIPCION:               form.DESCRIPCION           || null,
        ID_ALMACEN:                idAlmacen,
        ACTIVO:                    true,
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
          <h3 className="text-sm font-bold text-gray-900">Nuevo Grupo de Activos</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          <div>
            <Label required>Almacén</Label>
            <input value={nombreAlmacen || ''} disabled className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600" />
          </div>
          <div>
            <Label required>Nombre del grupo</Label>
            <input value={form.NOMBRE} onChange={e => set('NOMBRE', e.target.value)} placeholder="Ej: Equipos de Oficina, Deportes 2024..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <Label>Código identificador</Label>
            <input value={form.COD_IDENTIFICADOR_GENERAL} onChange={e => set('COD_IDENTIFICADOR_GENERAL', e.target.value)} placeholder="Ej: GRP-001" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <Label>Descripción</Label>
            <textarea value={form.DESCRIPCION} onChange={e => set('DESCRIPCION', e.target.value)} rows={2} placeholder="Notas sobre el grupo..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
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
