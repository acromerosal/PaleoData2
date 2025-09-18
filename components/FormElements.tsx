import React from 'react';

interface FormElementProps {
  label: string;
  subLabel?: string;
  required?: boolean;
}

interface SelectInputProps extends FormElementProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  placeholder?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({ label, subLabel, options, selected, onChange, otherValue, onOtherChange, required, placeholder }) => (
  <div>
    <label htmlFor={label} className="block text-lg font-semibold text-gris-oscuro dark:text-zinc-300">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {subLabel && <p className="text-base text-gris-oscuro/80 dark:text-zinc-400 mb-1">{subLabel}</p>}
    <select
      id={label}
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 block w-full pl-3 pr-10 py-2 bg-white dark:bg-zinc-700 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-institucional text-lg"
    >
      <option value="" disabled>{placeholder || `Seleccione una opción...`}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    {selected === 'Otro' && onOtherChange && (
      <input
        type="text"
        value={otherValue}
        onChange={(e) => onOtherChange(e.target.value)}
        className="mt-2 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-verde-institucional text-lg"
        placeholder="Por favor especifique"
      />
    )}
  </div>
);

interface RadioGroupInputProps extends FormElementProps {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
}

export const RadioGroupInput: React.FC<RadioGroupInputProps> = ({ label, subLabel, options, selected, onChange, otherValue, onOtherChange, required }) => (
  <div>
    <label className="block text-lg font-semibold text-gris-oscuro dark:text-zinc-300">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
    {subLabel && <p className="text-base text-gris-oscuro/80 dark:text-zinc-400 mb-2">{subLabel}</p>}
    <div className="space-y-2 mt-1">
      {options.map(option => (
        <div key={option} className="flex items-center">
          <input
            id={`${label}-${option}`}
            name={label}
            type="radio"
            value={option}
            checked={selected === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 text-verde-institucional focus:ring-verde-institucional border-gris-claro dark:border-zinc-600 bg-white dark:bg-zinc-900"
          />
          <label htmlFor={`${label}-${option}`} className="ml-3 block text-lg font-medium text-gris-oscuro dark:text-zinc-300">
            {option}
          </label>
        </div>
      ))}
      {selected === 'Otro' && onOtherChange && (
         <input
            type="text"
            value={otherValue}
            onChange={(e) => onOtherChange(e.target.value)}
            className="mt-2 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-verde-institucional text-lg"
            placeholder="Por favor especifique"
        />
      )}
    </div>
  </div>
);

interface TextInputProps extends Omit<FormElementProps, 'subLabel'> {
    value: string;
    onChange: (value: string) => void;
    prefix?: string;
    type?: 'text' | 'number';
}

export const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, prefix, required, type = 'text' }) => (
    <div>
        <label htmlFor={label} className="block text-lg font-medium text-gris-oscuro dark:text-zinc-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-1 flex items-center w-full bg-white dark:bg-zinc-700 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-verde-institucional">
            {prefix && (
                <span className="pl-3 pr-1 text-gris-oscuro/80 dark:text-zinc-400 select-none text-lg">{prefix}</span>
            )}
            <input
                id={label}
                type={type === 'number' ? 'text' : type}
                inputMode={type === 'number' ? 'numeric' : 'text'}
                pattern={type === 'number' ? '[0-9]*' : undefined}
                value={value}
                onChange={(e) => {
                    const val = e.target.value;
                    if (type === 'number') {
                        if (/^[0-9]*$/.test(val)) {
                            onChange(val);
                        }
                    } else {
                        onChange(val);
                    }
                }}
                className={`w-full bg-transparent border-none py-2 pr-3 focus:ring-0 text-lg text-gris-oscuro dark:text-zinc-300 placeholder-zinc-400 dark:placeholder-zinc-500 ${!prefix ? 'pl-3' : ''}`}
            />
        </div>
    </div>
);

interface DateInputProps extends Omit<FormElementProps, 'subLabel'> {
    value: string;
    onChange: (value: string) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ label, value, onChange, required }) => (
    <div>
        <label htmlFor={label} className="block text-lg font-medium text-gris-oscuro dark:text-zinc-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            id={label}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-verde-institucional text-lg"
        />
    </div>
);

interface TextAreaInputProps extends Omit<FormElementProps, 'subLabel'> {
    value: string;
    onChange: (value: string) => void;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, value, onChange, required }) => (
    <div>
        <label htmlFor={label} className="block text-lg font-medium text-gris-oscuro dark:text-zinc-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            id={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-gris-claro dark:border-zinc-600 rounded-md shadow-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-verde-institucional text-lg"
        />
    </div>
);