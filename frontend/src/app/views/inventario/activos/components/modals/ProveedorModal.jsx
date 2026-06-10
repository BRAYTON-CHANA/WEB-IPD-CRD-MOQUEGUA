import React, { useState } from 'react';
import { db } from '@/shared/api';
import { Label, Input } from '../ui/FormFields';

export function ProveedorModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ 
    NOMBRE_PROVEEDOR: '', 
    RUC: '', 
    CONTACTO_NOMBRE: '', 
    TELEFONO: '', 
    EMAIL: '', 
    DIRECCION: '', 
    DISTRITO: '', 
    PROVINCIA: '', 
    REGION: '' 
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleGuardar = async () => {
    if (!form.NOMBRE_PROVEEDOR.trim()) { 
      setError('El nombre del proveedor es obligatorio'); 
      return; 
    }
    if (!form.RUC.trim()) { 
      setError('El RUC es obligatorio'); 
      return; 
    }
    if (form.RUC.trim().length !== 11) { 
      setError('El RUC debe tener 11 dígitos'); 
      return; 
    }
    
    setSaving(true);
    setError(null);
    try {
      const created = await db.insert('PROVEEDORES', {
        NOMBRE_PROVEEDOR: form.NOMBRE_PROVEEDOR.trim(),
        RUC: form.RUC.trim(),
        CONTACTO_NOMBRE: form.CONTACTO_NOMBRE.trim() || null,
        TELEFONO: form.TELEFONO.trim() || null,
        EMAIL: form.EMAIL.trim() || null,
        DIRECCION: form.DIRECCION.trim() || null,
        DISTRITO: form.DISTRITO.trim() || null,
        PROVINCIA: form.PROVINCIA.trim() || null,
        REGION: form.REGION.trim() || null,
        ACTIVO: true,
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900">Nuevo Proveedor</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Nombre del proveedor</Label>
              <Input value={form.NOMBRE_PROVEEDOR} onChange={e => set('NOMBRE_PROVEEDOR', e.target.value)} placeholder="Empresa S.A.C." />
            </div>
            <div>
              <Label required>RUC</Label>
              <Input value={form.RUC} onChange={e => set('RUC', e.target.value)} placeholder="12345678901" maxLength={11} />
            </div>
          </div>

          <div>
            <Label>Nombre del contacto</Label>
            <Input value={form.CONTACTO_NOMBRE} onChange={e => set('CONTACTO_NOMBRE', e.target.value)} placeholder="Juan Pérez" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Teléfono</Label>
              <Input value={form.TELEFONO} onChange={e => set('TELEFONO', e.target.value)} placeholder="987654321" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.EMAIL} onChange={e => set('EMAIL', e.target.value)} placeholder="contacto@empresa.com" />
            </div>
          </div>

          <div>
            <Label>Dirección</Label>
            <Input value={form.DIRECCION} onChange={e => set('DIRECCION', e.target.value)} placeholder="Av. Principal 123" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Región</Label>
              <Input value={form.REGION} onChange={e => set('REGION', e.target.value)} placeholder="Lima" />
            </div>
            <div>
              <Label>Provincia</Label>
              <Input value={form.PROVINCIA} onChange={e => set('PROVINCIA', e.target.value)} placeholder="Lima" />
            </div>
            <div>
              <Label>Distrito</Label>
              <Input value={form.DISTRITO} onChange={e => set('DISTRITO', e.target.value)} placeholder="San Luis" />
            </div>
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
