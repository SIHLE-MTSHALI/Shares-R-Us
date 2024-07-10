import React from 'react';

const FormInput = ({ id, label, type, value, onChange, error, disabled }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block mb-2">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : ''}`}
        disabled={disabled}
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;