import React, { useState } from 'react';
import { PatternDefinition, ParamConfig } from '@/types/git-patterns';

interface PatternCardProps {
    pattern: PatternDefinition;
}

// Type for the params state object
type PatternParams = Record<string, string | number>;

// Type guard to check if a param is a number param
const isNumberParam = (param: ParamConfig): boolean => param.type === 'number';

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
        <div className="rounded-lg border border-[#30363d] bg-[#161b22] overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b border-[#30363d]">
                <pattern.icon className="w-5 h-5" />
                <div>
                    <h2 className="text-[#c9d1d9] font-medium">{pattern.title}</h2>
                    <p className="text-[#8b949e] text-sm">{pattern.description}</p>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {pattern.params.map(param => (
                    <div key={param.name} className="space-y-1.5">
                        <label className="text-[#c9d1d9] text-sm font-medium">
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
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[#c9d1d9] text-sm"
                            >
                                {param.options?.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : param.type === 'number' ? (
                            <input
                                type="number"
                                value={Number(params[param.name])}
                                onChange={(e) => handleParamChange(param, Number(e.target.value))}
                                min={param.min}
                                max={param.max}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[#c9d1d9] text-sm"
                            />
                        ) : (
                            <input
                                type="text"
                                value={String(params[param.name])}
                                onChange={(e) => handleParamChange(param, e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-[#c9d1d9] text-sm"
                            />
                        )}
                    </div>
                ))}

                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[#c9d1d9] text-sm font-medium">Generated Command</label>
                        <button
                            onClick={() => navigator.clipboard.writeText(command)}
                            className="text-xs px-2.5 py-1 rounded-md bg-[#238636] text-white hover:bg-[#2ea043] transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                    <pre className="bg-[#0d1117] p-4 rounded-md overflow-x-auto text-[#c9d1d9] text-sm">
            <code>{command}</code>
          </pre>
                </div>
            </div>
        </div>
    );
};
