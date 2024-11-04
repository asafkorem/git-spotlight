import React, { useState } from 'react';
import { PatternDefinition, ParamConfig } from '@/types/git-patterns';
import { CodeBlock } from './CodeBlock';
import {CustomNumberInput} from "@/components/CustomNumberInput";

interface PatternCardProps {
    pattern: PatternDefinition;
}

type PatternParams = Record<string, string | number>;

export const PatternCard: React.FC<PatternCardProps> = ({ pattern }) => {
    const [params, setParams] = useState<PatternParams>(() =>
        pattern.params.reduce((acc, param) => ({
            ...acc,
            [param.name]: param.defaultValue
        }), {} as PatternParams)
    );

    const handleParamChange = (param: ParamConfig, value: string | number) => {
        setParams(prev => ({
            ...prev,
            [param.name]: value
        }));
    };

    const command = pattern.generateCommand(params);

    return (
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] overflow-hidden shadow-lg shadow-[#0d1117]/50 hover:border-[#3d4449] transition-all duration-200">
            <div className="p-5 flex items-center gap-4 border-b border-[#30363d]">
                <div className="p-2 rounded-full bg-[#0d1117]/50">
                    <pattern.icon color={pattern.iconColor} className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-[#c9d1d9] font-semibold text-lg">{pattern.title}</h2>
                    <p className="text-[#8b949e] text-sm">{pattern.description}</p>
                </div>
            </div>

            <div className="p-5 space-y-5">
                {pattern.params.map(param => (
                    <div key={param.name} className="space-y-2">
                        <label className="text-[#c9d1d9] text-sm font-medium block">
                            {param.label}
                            {param.description && (
                                <span className="text-[#8b949e] ml-2 text-xs font-normal">
                                    {param.description}
                                </span>
                            )}
                        </label>

                        {param.type === 'select' ? (
                            <select
                                value={String(params[param.name])}
                                onChange={(e) => handleParamChange(param, e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg pl-3 pr-8 py-2 text-[#c9d1d9] text-sm
    focus:outline-none focus:ring-1 focus:ring-[#888b99]/40 focus:border-[#888b99]
    hover:border-[#3d4449] transition-colors duration-200
    appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiM4YjkxOTgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNC40MjcgOS40MjdsMy4zOTYgMy4zOTZhLjI1MS4yNTEgMCAwMC4zNTQgMGwzLjM5Ni0zLjM5NkEuMjUuMjUgMCAwMDExLjM5NiA5SDQuNjA0YS4yNS4yNSAwIDAwLS4xNzcuNDI3ek0xMS4zOTYgN0g0LjYwNGEuMjUuMjUgMCAwMS0uMTc3LS40MjdsMy4zOTYtMy4zOTZhLjI1MS4yNTEgMCAwMS4zNTQgMGwzLjM5NiAzLjM5NkEuMjUuMjUgMCAwMTExLjM5NiA3eiI+PC9wYXRoPjwvc3ZnPg==')]
    bg-[length:16px_16px] bg-no-repeat bg-[right_8px_center]"
                            >
                                {param.options?.map(option => (
                                    <option
                                        key={option}
                                        value={option}
                                        className="bg-[#0d1117] text-[#c9d1d9]"
                                    >
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : param.type === 'number' ? (
                            // Update the number input className:
                            <CustomNumberInput
                                value={Number(params[param.name])}
                                onChange={(value) => handleParamChange(param, value)}
                                min={param.min}
                                max={param.max}
                            />
                        ) : (
                            <input
                                type="text"
                                value={String(params[param.name])}
                                onChange={(e) => handleParamChange(param, e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-[#c9d1d9] text-sm
                                focus:outline-none focus:ring-1 focus:ring-[#888b99]/40 focus:border-[#888b99]
                                hover:border-[#3d4449] transition-colors duration-200"
                            />
                        )}
                    </div>
                ))}

                <div className="mt-6">
                    <label className="text-[#c9d1d9] text-sm font-medium mb-2 block">Generated Command</label>
                    <CodeBlock code={command} />
                </div>
            </div>
        </div>
    );
};
