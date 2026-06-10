import React, { useState, useEffect } from 'react';
import { db } from '@/shared/api';
import { Label, Input, Select } from '../ui/FormFields';

export function EmpleadoModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ 
    ID_OFICINA: '', 
    ID_CARGO: '', 
    DNI: '', 
    NOMBRES: '', 
    APELLIDOS: '', 
    NOMBRE_ABREV: '', 
    EMAIL: '', 
    TELEFONO: '', 
    COMENTARIOS: '' 
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);
  const [oficinas, setOficinas] = useState([]);
  const [cargos, setCargos] = useState([]);

  useEffect(() => {
    // Cargar oficinas y cargos para los selects
    Promise.all([
      db.select('vw_oficinas_por_infraestructura', { OFICINA_ACTIVO: true }, [
        'ID_OFICINA', 'NOMBRE_OFICINA', 'INFRAESTRUCTURA'
      ]),
      db.select('CARGOS', { ACTIVO: true }, ['ID_CARGO', 'NOMBRE_CARGO'])
    ]).then(([ofs, cgs]) => {
      setOficinas(ofs || []);
      setCargos(cgs || []);
    });
  }, []);

  const set = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleGuardar = async () => {
    if (!form.DNI.trim() || !form.NOMBRES.trim() || !form.APELLIDOS.trim()) { 
      setError('DNI, Nombres y Apellidos son obligatorios'); 
      return; 
    }
    if (!form.ID_OFICINA) { setError('Debe seleccionar una oficina'); return; }
    if (!form.ID_CARGO) { setError('Debe seleccionar un cargo'); return; }
    
    setSaving(true);
    setError(null);
    try {
      const created = await db.insert('EMPLEADOS', {
        ID_OFICINA: Number(form.ID_OFICINA),
        ID_CARGO: Number(form.ID_CARGO),
        DNI: form.DNI.trim(),
        NOMBRES: form.NOMBRES.trim(),
        APELLIDOS: form.APELLIDOS.trim(),
        NOMBRE_ABREV: form.NOMBRE_ABREV.trim() || null,
        EMAIL: form.EMAIL.trim() || null,
        TELEFONO: form.TELEFONO.trim() || null,
        COMENTARIOS: form.COMENTARIOS || null,
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
          <h3 className="text-sm font-bold text-gray-900">Nuevo Empleado</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>Oficina</Label>
              <Select value={form.ID_OFICINA} onChange={e => set('ID_OFICINA', e.target.value)}>
                <option value="">Seleccione...</option>
                {oficinas.map(o => (
                  <option key={o.ID_OFICINA} value={o.ID_OFICINA}>
                    {o.NOMBRE_OFICINA} - {o.INFRAESTRUCTURA}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label required>Cargo</Label>
              <Select value={form.ID_CARGO} onChange={e => set('ID_CARGO', e.target.value)}>
                <option value="">Seleccione...</option>
                {cargos.map(c => (
                  <option key={c.ID_CARGO} value={c.ID_CARGO}>{c.NOMBRE_CARGO}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label required>DNI</Label>
              <Input value={form.DNI} onChange={e => set('DNI', e.target.value)} placeholder="12345678" />
            </div>
            <div>
              <Label>Nombre abreviado</Label>
              <Input value={form.NOMBRE_ABREV} onChange={e => set('NOMBRE_ABREV', e.target.value)} placeholder="J. Pérez" />
            </div>
          </div>

          <div>
            <Label required>Nombres</Label>
            <Input value={form.NOMBRES} onChange={e => set('NOMBRES', e.target.value)} placeholder="Juan Carlos" />
          </div>

          <div>
            <Label required>Apellidos</Label>
            <Input value={form.APELLIDOS} onChange={e => set('APELLIDOS', e.target.value)} placeholder="Pérez García" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Email</Label>
              <Input value={form.EMAIL} onChange={e => set('EMAIL', e.target.value)} placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <Label>Teléfono</Label>
              <Input value={form.TELEFONO} onChange={e => set('TELEFONO', e.target.value)} placeholder="987654321" />
            </div>
          </div>

          <div>
            <Label>Comentarios</Label>
            <textarea 
              value={form.COMENTARIOS} 
              onChange={e => set('COMENTARIOS', e.target.value)} 
              rows={2} 
              placeholder="Notas adicionales..." 
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300" 
            />
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
