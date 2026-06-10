import React, { useState } from 'react';

export const ESTADOS_CONSERVACION = ['Excelente', 'Bueno', 'Regular', 'Malo', 'Obsoleto'];

export function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-gray-600 mb-1">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function Input({ label, required, error, ...props }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <input
        {...props}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${error ? 'border-red-300' : 'border-gray-200'} ${props.disabled ? 'bg-gray-50 text-gray-500' : ''}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function Select({ label, required, error, children, ...props }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <select
        {...props}
        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${error ? 'border-red-300' : 'border-gray-200'} bg-white`}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

export function RefreshBtn({ onRefresh }) {
  const [spinning, setSpinning] = useState(false);
  const handle = async () => {
    if (spinning) return;
    setSpinning(true);
    try { await onRefresh(); } finally { setSpinning(false); }
  };
  return (
    <button
      type="button"
      onClick={handle}
      disabled={spinning}
      title="Recargar opciones"
      className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40"
    >
      <svg className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  );
}

export function RefSelect({ label, required, error, options, valueKey, labelKey, labelFn, value, onChange, placeholder, onRefresh, disabled }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="flex gap-1.5 items-center">
        <select
          value={value != null ? String(value) : ''}
          onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
          disabled={disabled}
          className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 ${error ? 'border-red-300' : 'border-gray-200'} bg-white ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
        >
          <option value="">{placeholder || 'Seleccione...'}</option>
          {options.map(opt => (
            <option key={opt[valueKey]} value={String(opt[valueKey])}>
              {labelFn ? labelFn(opt) : opt[labelKey]}
            </option>
          ))}
        </select>
        {onRefresh && !disabled && <RefreshBtn onRefresh={onRefresh} />}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
