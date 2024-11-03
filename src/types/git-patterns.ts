import { LucideIcon } from 'lucide-react';

export interface ParamConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'select';
    defaultValue: string | number;
    options?: string[];
    min?: number;
    max?: number;
    description?: string;
}

export interface PatternDefinition {
    id: string;
    icon: LucideIcon;  // Changed from ReactNode to LucideIcon
    title: string;
    description: string;
    params: ParamConfig[];
    generateCommand: (params: Record<string, string | number>) => string;
}
