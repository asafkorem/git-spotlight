'use client';

import { patterns } from '@/config/patterns';
import { PatternCard } from '@/components/PatternCard';

export default function Home() {
  return (
      <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Section */}
          <header className="text-center py-8">
            <h1 className="text-3xl font-bold mb-4">Git Spotlight</h1>
            <p className="text-[#8b949e] max-w-2xl mx-auto">
              Discover insights in your git history with these carefully crafted command patterns.
              Each pattern helps you identify different aspects of your codebase.
            </p>
          </header>

          {/* Patterns Grid */}
          <div className="grid grid-cols-1 gap-6">
            {patterns.map(pattern => (
                <PatternCard
                    key={pattern.id}
                    pattern={pattern}
                />
            ))}
          </div>

          {/* Footer */}
          <footer className="text-center text-[#8b949e] text-sm py-8">
            <p>
              Originally presented in <span className="text-[#ffffff]">"Pinpointing Pain Points in Your Code: Effective Value-Driven Refactoring"</span>
              <br/>
              <span className="text-[#8b949e]">by Asaf Korem • Wix Engineering Conference 2024</span>
            </p>
          </footer>
        </div>
      </div>
  );
}
