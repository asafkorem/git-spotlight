import { Flame, Skull } from 'lucide-react';
import { PatternDefinition } from '@/types/git-patterns';
import { createGitCommand } from '@/utils/git-commands';

export const hotspotPattern: PatternDefinition = {
    id: 'hotspots',
    icon: Flame,
    title: 'Hotspots 🌶️',
    description: 'Track frequently changing files that might need attention',
    params: [
        {
            name: 'timeWindow',
            label: 'Time Window',
            type: 'select',
            options: ['1 month', '3 months', '6 months', '1 year', '2 years'],
            defaultValue: '6 months'
        },
        {
            name: 'keywords',
            label: 'Filter by commit messages',
            type: 'text',
            defaultValue: 'fix,bug,refactor',
            description: 'Optional: filter by keywords in commit messages'
        },
        {
            name: 'limit',
            label: 'Show top files',
            type: 'number',
            min: 5,
            max: 50,
            defaultValue: 10
        }
    ],
    generateCommand: (params) => `
# Find most frequently changed files
${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string)} | \\
  sort | \\
  uniq -c | \\
  sort -nr | \\
  head -${params.limit}
  `
};

export const dungeonPattern: PatternDefinition = {
    id: 'dungeons',
    icon: Skull,
    title: 'Dungeons 💀',
    description: 'Find files with high activity but few contributors',
    params: [
        {
            name: 'timeWindow',
            label: 'Time Window',
            type: 'select',
            options: ['1 month', '3 months', '6 months', '1 year', '2 years'],
            defaultValue: '1 year'
        },
        {
            name: 'keywords',
            label: 'Filter by commit messages',
            type: 'text',
            defaultValue: 'fix,bug,refactor',
            description: 'Optional: filter by keywords in commit messages'
        },
        {
            name: 'minChanges',
            label: 'Minimum changes',
            type: 'number',
            min: 1,
            max: 100,
            defaultValue: 5
        },
        {
            name: 'maxAuthors',
            label: 'Maximum authors',
            type: 'number',
            min: 1,
            max: 10,
            defaultValue: 2
        }
    ],
    generateCommand: (params) => `
# Get all unique files from git history
files=$(${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string)} | sort -u)

# For each file, check changes and authors
echo "$files" | while read -r file; do
  if [ ! -z "$file" ]; then
    # Count changes
    changes=$(${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string)} | grep -c "^$file" || echo 0)
    
    # If changes meet minimum threshold
    if [ "$changes" -ge ${params.minChanges} ]; then
      # Count unique authors
      author_count=$(${createGitCommand.getAuthors("$file", params.timeWindow as string)} | wc -l)
      
      # If author count is within maximum
      if [ "$author_count" -le ${params.maxAuthors} ]; then
        echo "File: $file"
        echo "Changes: $changes"
        echo "Authors: "
        ${createGitCommand.getAuthorContributions("$file", params.timeWindow as string)} | \\
          awk '{
            count=$1
            author=$2
            for(i=3;i<=NF;i++) author=author " " $i
            printf "  %s: %d changes\\n", author, count
          }'
        echo "---"
      fi
    fi
  fi
done
`
};

export const patterns = [
    hotspotPattern,
    dungeonPattern
] as const;
