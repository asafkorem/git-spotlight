import { ReactNode } from 'react';

// Make parameter types more specific
export type ParamType = {
    text: string;
    number: number;
    select: string;
};

// Configuration for any parameter field
export interface ParamConfig {
    name: string;
    label: string;
    type: keyof ParamType;
    defaultValue: ParamType[keyof ParamType];
    options?: string[]; // For select type
    min?: number;      // For number type
    max?: number;      // For number type
    // Optional description for tooltip/help text
    description?: string;
}

// Pattern definition with all its metadata and behavior
export interface PatternDefinition {
    id: string;
    icon: ReactNode;
    title: string;
    description: string;
    params: ParamConfig[];
    generateCommand: (params: Record<string, ParamType[keyof ParamType]>) => string;
}

// Runtime parameter values type that ensures values match their parameter type
export type PatternParams<T extends PatternDefinition> = {
    [K in T['params'][number]['name']]: ParamType[Extract<T['params'][number], { name: K }>['type']]
};
