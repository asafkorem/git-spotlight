import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface CustomNumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    className?: string;
}

export const CustomNumberInput: React.FC<CustomNumberInputProps> = ({
                                                                        value,
                                                                        onChange,
                                                                        min,
                                                                        max,
                                                                        className
                                                                    }) => {
    return (
        <div className="flex items-center gap-2">
            <input
                type="number"
                value={value}
                onChange={(e) => {
                    const newValue = Number(e.target.value);
                    if ((min === undefined || newValue >= min) &&
                        (max === undefined || newValue <= max)) {
                        onChange(newValue);
                    }
                }}
                className={`w-24 bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1.5 
                text-left text-[#c9d1d9] text-sm focus:outline-none focus:ring-1 
                focus:ring-[#388bfd]/40 focus:border-[#388bfd] hover:border-[#3d4449] 
                transition-colors duration-200 [appearance:textfield] 
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none ${className}`}
                min={min}
                max={max}
            />
            <div className="inline-flex border border-[#30363d] rounded-lg overflow-hidden">
                <button
                    type="button"
                    onClick={() => onChange(Math.max((min ?? -Infinity), value - 1))}
                    disabled={min !== undefined && value <= min}
                    className="px-2 py-1.5 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d]
                    disabled:text-[#484f58] disabled:hover:bg-transparent
                    disabled:cursor-not-allowed transition-colors duration-200 border-r border-[#30363d]"
                >
                    <Minus className="w-3 h-3" strokeWidth={2.5} />
                </button>
                <button
                    type="button"
                    onClick={() => onChange(Math.min((max ?? Infinity), value + 1))}
                    disabled={max !== undefined && value >= max}
                    className="px-2 py-1.5 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d]
                    disabled:text-[#484f58] disabled:hover:bg-transparent
                    disabled:cursor-not-allowed transition-colors duration-200"
                >
                    <Plus className="w-3 h-3" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};
