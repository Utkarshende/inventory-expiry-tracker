import React from 'react';

const InputField = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  disabled = false, 
  required = true, 
  icon: Icon,
  fontClass = '',
  step
}) => {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3 top-2.5 text-gray-400" />
        )}
        <input
          type={type}
          step={step}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white disabled:bg-gray-100 disabled:text-gray-500 outline-none focus:border-black transition ${Icon ? 'pl-9' : ''} ${fontClass}`}
        />
      </div>
    </div>
  );
};

export default InputField;