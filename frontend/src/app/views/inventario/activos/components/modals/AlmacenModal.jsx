import React, { useState, useEffect } from 'react';
import { db } from '@/shared/api';
import { Label, Select } from '../ui/FormFields';

export function AlmacenModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ NOMBRE_ALMACEN: '', TIPO_ALMACEN: '', ID_INFRAESTRUCTURA: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);
  const [infraestructuras, setInfraestructuras] = useState([]);

  useEffect(() => {
    db.select('INFRAESTRUCTURAS', { ACTIVO: true }, ['ID_INFRAESTRUCTURA', 'NOMBRE']).then(res => {
      setInfraestructuras(res || []);
    });
  }, []);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleGuardar = async () => {
    if (!form.NOMBRE_ALMACEN.trim()) { setError('El nombre es obligatorio'); return; }
    if (!form.ID_INFRAESTRUCTURA) { setError('Debe seleccionar una infraestructura'); return; }
    setSaving(true);
    setError(null);
    try {
      const created = await db.insert('ALMACENES', {
        NOMBRE_ALMACEN:     form.NOMBRE_ALMACEN.trim() || null,
        TIPO_ALMACEN:       form.TIPO_ALMACEN       || null,
        ID_INFRAESTRUCTURA: Number(form.ID_INFRAESTRUCTURA),
        ACTIVO:             true,
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
          <h3 className="text-sm font-bold text-gray-900">Nuevo Almacén</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          <div>
            <Label required>Nombre del almacén</Label>
            <input value={form.NOMBRE_ALMACEN} onChange={e => set('NOMBRE_ALMACEN', e.target.value)} placeholder="Ej: Almacén Central, Depósito Deportes..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div>
            <Label required>Infraestructura</Label>
            <Select value={form.ID_INFRAESTRUCTURA} onChange={e => set('ID_INFRAESTRUCTURA', e.target.value)}>
              <option value="">Seleccione...</option>
              {infraestructuras.map(i => (
                <option key={i.ID_INFRAESTRUCTURA} value={i.ID_INFRAESTRUCTURA}>{i.NOMBRE}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Tipo de almacén</Label>
            <input value={form.TIPO_ALMACEN} onChange={e => set('TIPO_ALMACEN', e.target.value)} placeholder="Ej: General, Deportes, Oficina..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" />
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
