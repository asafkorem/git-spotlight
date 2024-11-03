'use client';

import { patterns } from '@/config/patterns';
import { PatternCard } from '@/components/PatternCard';
import { Flashlight } from 'lucide-react';

export default function Home() {
  return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <header className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Flashlight
                  className="w-8 h-8 text-yellow-500 transform rotate-[145deg] animate-shine"
              />
              <h1 className="text-3xl font-bold text-glow">Git Spotlight</h1>
            </div>
            <p className="text-[#8b949e] max-w-2xl mx-auto mb-6">
              Discover insights in your git history with these carefully crafted command patterns.
              Each pattern helps you identify different aspects of your codebase.
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

          <footer className="text-center text-sm py-8">
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
          </footer>
        </div>
      </div>
  );
}
