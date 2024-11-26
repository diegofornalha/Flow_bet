import React from 'react';
import { Input } from './input';

interface Uint256InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: bigint | null) => void;
  value?: bigint | null;
  max?: bigint;
}

export function Uint256Input({ onChange, value, max, ...props }: Uint256InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos
    
    if (val === '') {
      onChange(null);
      return;
    }

    try {
      const bigIntValue = BigInt(val);
      
      // Verifica se o valor é maior que uint256 max
      const uint256Max = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935');
      
      if (bigIntValue > uint256Max) {
        onChange(uint256Max);
        return;
      }

      // Se max foi especificado, limita o valor
      if (max && bigIntValue > max) {
        onChange(max);
        return;
      }

      onChange(bigIntValue);
    } catch (error) {
      console.error('Erro ao converter para BigInt:', error);
      onChange(null);
    }
  };

  const displayValue = value === null ? '' : value.toString();

  return (
    <div className="relative">
      <Input
        {...props}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={displayValue}
        onChange={handleChange}
        className="pr-16 font-mono"
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span className="text-sm text-gray-500">uint256</span>
      </div>
    </div>
  );
} 