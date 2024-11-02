'use client';

import React, { useState } from 'react';
import { Flashlight, Flame, Skull, Magnet, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Type Definitions
type TimeWindow = '1 month' | '3 months' | '6 months' | '1 year' | '2 years';

interface BaseCommandParams {
  useGlobal: boolean;
  timeWindow: TimeWindow;
  keywords: string;
}

interface HotspotParams extends BaseCommandParams {
  limit: number;
}

interface DungeonParams extends BaseCommandParams {
  minChanges: number;
  maxAuthors: number;
}

interface MagnetParams extends BaseCommandParams {
  minCoupling: number;
}

interface CommandParams {
  hotspots: HotspotParams;
  dungeons: DungeonParams;
  magnets: MagnetParams;
}

interface ParamConfig {
  name: string;
  label: string;
  type: 'number';
  min: number;
  max: number;
}

// Create a type for each pattern with its specific params type
interface PatternBase<T extends keyof CommandParams> {
  id: T;
  icon: React.ReactNode;
  title: string;
  description: string;
  command: (params: CommandParams[T]) => string;
  params: ParamConfig[];
}

// Union type of all possible patterns
type Pattern = PatternBase<'hotspots'> | PatternBase<'dungeons'> | PatternBase<'magnets'>;

const TIME_WINDOWS: TimeWindow[] = ['1 month', '3 months', '6 months', '1 year', '2 years'];

const DEFAULT_PARAMS: CommandParams = {
  hotspots: {
    useGlobal: true,
    timeWindow: '1 year',
    keywords: 'fix,bug,refactor',
    limit: 10
  },
  dungeons: {
    useGlobal: true,
    timeWindow: '1 year',
    keywords: 'fix,bug,refactor',
    minChanges: 5,
    maxAuthors: 2
  },
  magnets: {
    useGlobal: true,
    timeWindow: '1 year',
    keywords: 'fix,bug,refactor',
    minCoupling: 3
  }
};

const patterns: Pattern[] = [
  {
    id: 'hotspots',
    icon: <Flame className="w-6 h-6 text-orange-500" />,
    title: "Hotspots 🌶️🔥",
    description: "Track frequently changing files that might need attention",
    command: (params: HotspotParams) => {
      const keywordFilter = params.keywords ? `--grep="${params.keywords.split(',').join('\\|')}" -i` : '';
      return `git log --since="${params.timeWindow} ago" ${keywordFilter} --name-only --pretty=format: | \
sort | uniq -c | sort -nr | head -${params.limit}`;
    },
    params: [
      {
        name: 'limit',
        label: 'Number of files to show',
        type: 'number',
        min: 5,
        max: 50
      }
    ]
  },
  {
    id: 'dungeons',
    icon: <Skull className="w-6 h-6 text-purple-500" />,
    title: "Dungeons 💀🐉",
    description: "Find complex code sections with limited maintainers",
    command: (params: DungeonParams) => {
      const keywordFilter = params.keywords ? `--grep="${params.keywords.split(',').join('\\|')}" -i` : '';
      return `git log --since="${params.timeWindow} ago" ${keywordFilter} --name-only --pretty=format: | \
sort | uniq | \
while read -r file; do
    if [ ! -z "$file" ]; then
        changes=$(git log --since="${params.timeWindow} ago" ${keywordFilter} --name-only | grep -c "^$file" || echo 0)
        if [ "$changes" -ge ${params.minChanges} ]; then
            author_count=$(git log --since="${params.timeWindow} ago" --pretty=format:"%an" -- "$file" | sort -u | wc -l)
            if [ "$author_count" -le ${params.maxAuthors} ]; then
                echo -n "$file ($changes changes, $author_count authors): "
                git log --since="${params.timeWindow} ago" --pretty=format:"%an" -- "$file" | \
                sort | uniq -c | sort -nr | \
                awk '{arr[$2]=$1; sum+=$1} 
                     END {
                         for (author in arr) {
                             printf "%s (%.1f%%) ", author, (arr[author]/sum)*100
                         }
                         print ""
                     }'
            fi
        fi
    fi
done | sort -t"(" -k2 -nr`;
    },
    params: [
      {
        name: 'minChanges',
        label: 'Minimum changes',
        type: 'number',
        min: 1,
        max: 100
      },
      {
        name: 'maxAuthors',
        label: 'Maximum authors',
        type: 'number',
        min: 1,
        max: 10
      }
    ]
  },
  {
    id: 'magnets',
    icon: <Magnet className="w-6 h-6 text-amber-500" />,
    title: "Dependency Magnets 🧲",
    description: "Identify files often changed together",
    command: (params: MagnetParams) => {
      const keywordFilter = params.keywords ? `--grep="${params.keywords.split(',').join('\\|')}" -i` : '';
      return `git log --since="${params.timeWindow} ago" ${keywordFilter} --name-only --pretty=format:"%h" | \
awk -v min=${params.minCoupling} '
BEGIN { commit = "" }
NF==1 { commit = $1; next }
{
    for (i=1; i<=NF; i++) {
        for (j=i+1; j<=NF; j++) {
            pair = ($i < $j) ? $i "|" $j : $j "|" $i
            count[pair]++
        }
    }
}
END {
    for (pair in count) {
        if (count[pair] >= min) {
            split(pair, files, "|")
            printf "%d times: %s <-> %s\\n", count[pair], files[1], files[2]
        }
    }
}' | sort -rn`;
    },
    params: [
      {
        name: 'minCoupling',
        label: 'Minimum coupling occurrences',
        type: 'number',
        min: 2,
        max: 50
      }
    ]
  }
] as const;

const getParamValue = <T extends keyof CommandParams>(
    params: CommandParams[T],
    paramName: string
): number => {
  const value = params[paramName as keyof typeof params];
  return typeof value === 'number' ? value : 0;
};

const GitSpotlight: React.FC = () => {
  const [globalTimeWindow, setGlobalTimeWindow] = useState<TimeWindow>('1 year');
  const [globalKeywords, setGlobalKeywords] = useState<string>('fix,bug,refactor');
  const [commandParams, setCommandParams] = useState<CommandParams>(DEFAULT_PARAMS);

  const updateCommandParams = <T extends keyof CommandParams>(
      command: T,
      params: Partial<CommandParams[T]>
  ) => {
    setCommandParams(prev => ({
      ...prev,
      [command]: { ...prev[command], ...params }
    }));
  };

  const getEffectiveParams = <T extends keyof CommandParams>(command: T): CommandParams[T] => {
    const params = commandParams[command];
    return {
      ...params,
      timeWindow: params.useGlobal ? globalTimeWindow : params.timeWindow,
      keywords: params.useGlobal ? globalKeywords : params.keywords,
    };
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
      <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Flashlight className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-4xl font-bold mb-4 text-yellow-500">GitSpotlight</h1>
            <p className="text-xl text-gray-300 mb-6">Illuminating your code's pain points through git history</p>
            <p className="text-sm text-gray-400">From "Pinpointing Pain Points in Your Code: Effective Value-Driven Refactoring" - Wix Engineering Conference 2024</p>
          </div>

          {/* Global Parameters Section */}
          <div className="mb-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold">Global Parameters</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Time Window</label>
                <select
                    value={globalTimeWindow}
                    onChange={(e) => setGlobalTimeWindow(e.target.value as TimeWindow)}
                    className="w-full p-2 bg-gray-700 border-gray-600 rounded-md text-gray-100"
                >
                  {TIME_WINDOWS.map(window => (
                      <option key={window} value={window}>Last {window}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Commit Keywords (comma-separated, leave empty for all commits)
                </label>
                <input
                    type="text"
                    value={globalKeywords}
                    onChange={(e) => setGlobalKeywords(e.target.value)}
                    placeholder="e.g., fix,bug,refactor"
                    className="w-full p-2 bg-gray-700 border-gray-600 rounded-md text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Patterns Section */}
          <div className="space-y-8">
            {patterns.map((pattern) => {
              const params = getEffectiveParams(pattern.id);
              return (
                  <Card key={pattern.id} className="bg-gray-800 border-gray-700">
                    <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-750">
                      {pattern.icon}
                      <div>
                        <CardTitle className="text-lg text-gray-100">{pattern.title}</CardTitle>
                        <p className="text-sm text-gray-400">{pattern.description}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-850 p-4 rounded-md space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                              type="checkbox"
                              checked={commandParams[pattern.id].useGlobal}
                              onChange={(e) => updateCommandParams(pattern.id, {useGlobal: e.target.checked})}
                              className="rounded bg-gray-700"
                          />
                          <label className="text-sm text-gray-300">Use global parameters</label>
                        </div>

                        {!commandParams[pattern.id].useGlobal && (
                            <div className="space-y-3 pl-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Time Window</label>
                                <select
                                    value={commandParams[pattern.id].timeWindow}
                                    onChange={(e) => updateCommandParams(pattern.id, {timeWindow: e.target.value as TimeWindow})}
                                    className="w-full p-2 bg-gray-700 border-gray-600 rounded-md text-gray-100"
                                >
                                  {TIME_WINDOWS.map(window => (
                                      <option key={window} value={window}>Last {window}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Keywords</label>
                                <input
                                    type="text"
                                    value={commandParams[pattern.id].keywords}
                                    onChange={(e) => updateCommandParams(pattern.id, {keywords: e.target.value})}
                                    className="w-full p-2 bg-gray-700 border-gray-600 rounded-md text-gray-100"
                                />
                              </div>
                            </div>
                        )}

                        <div className="space-y-3 pt-2">
                          {pattern.params.map((param) => (
                              <div key={param.name}>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                  {param.label}
                                </label>
                                <input
                                    type={param.type}
                                    min={param.min}
                                    max={param.max}
                                    value={getParamValue(commandParams[pattern.id], param.name)}
                                    onChange={(e) =>
                                        updateCommandParams(pattern.id, {
                                          [param.name]: Number(e.target.value)
                                        })
                                    }
                                    className="w-full p-2 bg-gray-700 border-gray-600 rounded-md text-gray-100"
                                />
                              </div>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                    <pre className="bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{pattern.command(params)}</code>
                    </pre>
                        <button
                            onClick={() => handleCopyToClipboard(pattern.command(params))}
                            className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-100 rounded hover:bg-gray-600 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                    </CardContent>
                  </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center space-y-4">
            <p className="text-gray-400">Customize parameters for each pattern or use global settings</p>
            <div className="flex justify-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">git log</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">analytics</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-800 text-gray-300">patterns</span>
          </div>
        </div>
      </div>
</div>
);
};

export default GitSpotlight;
