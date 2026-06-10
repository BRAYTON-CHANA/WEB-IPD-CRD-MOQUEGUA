import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/shared/api';
import { Label } from './FormFields';

export function UniqueSelect({ tableName, columnName, value, onChange, placeholder, label, required }) {
  const [options, setOptions] = useState([]);
  const [adding, setAdding]   = useState(false);
  const [newVal, setNewVal]   = useState('');
  const inputRef              = useRef(null);

  useEffect(() => {
    db.rawSelect(
      `SELECT DISTINCT "${columnName}" FROM "${tableName}" WHERE "${columnName}" IS NOT NULL ORDER BY "${columnName}"`
    ).then(rows => setOptions((rows || []).map(r => r[columnName])));
  }, [tableName, columnName]);

  useEffect(() => {
    if (adding && inputRef.current) inputRef.current.focus();
  }, [adding]);

  const handleConfirm = () => {
    const v = newVal.trim();
    if (!v) return;
    if (!options.includes(v)) setOptions(prev => [...prev, v].sort());
    onChange(v);
    setAdding(false);
    setNewVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleConfirm(); }
    if (e.key === 'Escape') { setAdding(false); setNewVal(''); }
  };

  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="flex gap-1.5 items-center">
        <select
          value={value || ''}
          onChange={e => onChange(e.target.value || null)}
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        >
          <option value="">{placeholder || 'Seleccione...'}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            title="Agregar nuevo valor"
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ) : (
          <div className="flex gap-1 items-center">
            <input
              ref={inputRef}
              value={newVal}
              onChange={e => setNewVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nuevo valor..."
              className="w-28 px-2 py-1.5 text-sm border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button type="button" onClick={handleConfirm} className="w-7 h-7 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </button>
            <button type="button" onClick={() => { setAdding(false); setNewVal(''); }} className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg text-xs">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
