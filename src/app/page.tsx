'use client';

import { patterns } from '@/config/patterns';
import { PatternCard } from '@/components/PatternCard';
import { Flashlight } from 'lucide-react';

export default function Home() {
  return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <header className="text-center py-1">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flashlight
                  className="w-8 h-8 text-yellow-500 transform rotate-[145deg] animate-shine"
              />
              <h1 className="text-3xl font-bold text-glow">Git Spotlight</h1>
            </div>
            <p className="text-[#8b949e] max-w-2xl mx-auto mb-3">
              Spot pain points in your code through git history
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6">
            {patterns.map(pattern => (
                <PatternCard
                    key={pattern.id}
                    pattern={pattern}
                />
            ))}
          </div>

          <footer className="text-center text-sm py-8 space-y-4">
            <p className="text-[#8b949e]">
              Originally presented in{' '}
              <span className="text-[#c9d1d9]">
              "Pinpointing Pain Points in Your Code: Effective Value-Driven Refactoring"
            </span>
              <br />
              <span className="text-[#8b949e]">
              by Asaf Korem • Wix Engineering Conference 2024
            </span>
            </p>

            <a
                href="https://github.com/asafkorem/git-spotlight"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full
                     bg-[#21262d] hover:bg-[#30363d]
                     border border-[#30363d] hover:border-[#8b949e]
                     transition-all duration-200 ease-in-out group
                     text-[#c9d1d9] hover:text-white"
            >
              <img
                  src="/github.svg"
                  alt="GitHub"
                  className="w-5 h-5 opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <span>Contribute on GitHub</span>
            </a>
          </footer>
        </div>
      </div>
  );
}
