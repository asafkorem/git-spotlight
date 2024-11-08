import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'shell' }) => { // Changed default to shell
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <pre className="bg-[#0d1117] p-4 rounded-lg overflow-x-auto text-[#c9d1d9] text-sm border border-[#30363d]
                          font-mono selection:bg-[#264f78] max-h-[400px] overflow-y-auto
                          scrollbar-thin scrollbar-thumb-[#30363d] scrollbar-track-transparent">
                <div className="absolute right-2 top-2 z-10">
                    <button
                        onClick={handleCopy}
                        className="p-2 text-[#8b949e] hover:text-[#c9d1d9] rounded-md
                                 bg-[#161b22] hover:bg-[#1f242c] border border-[#30363d]
                                 transition-all duration-200 shadow-sm"
                        title="Copy to clipboard"
                    >
                        {isCopied ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
                <code className={`language-${language} block`}>
                    {code}
                </code>
            </pre>
        </div>
    );
};
