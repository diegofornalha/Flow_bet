import React from 'react';
import { Input } from './input';

interface Uint256InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void;
  value?: string;
}

export function Uint256Input({ onChange, value, ...props }: Uint256InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos
    onChange(val);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value || ''}
        onChange={handleChange}
        className="pr-16 font-mono"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-sm text-gray-500">uint256</span>
      </div>
    </div>
  );
} 