import { Flame, Skull, Link } from 'lucide-react';
import { PatternDefinition } from '@/types/git-patterns';
import { createGitCommand } from '@/utils/git-commands';

export const hotspotPattern: PatternDefinition = {
    id: 'hotspots',
    icon: Flame,
    iconColor: '#bd2424',
    title: 'Hotspots️',
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
            name: 'filePattern',
            label: 'File patterns',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., js,ts,!test.ts,!spec.js',
            description: 'Filter by file extensions or patterns. Use ! to exclude. Separate with commas'
        },
        {
            name: 'keywords',
            label: 'Filter by commit messages',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., fix,bug,hotfix,patch',
            description: 'Filter by keywords in commit messages, separated by commas. Leave empty for all commits'
        },
        {
            name: 'limit',
            label: 'Show top files',
            type: 'number',
            min: 5,
            max: 50,
            defaultValue: 10,
            placeholder: 'e.g., 10'
        }
    ],
    generateCommand: (params) => `
echo "Finding most frequently changed files..."
${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string, params.filePattern as string)} | \\
  grep -v "^$" | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  head -${params.limit} | \\
  awk '{printf "%5d changes: %s\\n", $1, $2}'
`
};

export const dungeonPattern: PatternDefinition = {
    id: 'dungeons',
    icon: Skull,
    iconColor: '#aeaeae',
    title: 'Dungeons',
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
            name: 'filePattern',
            label: 'File patterns',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., js,ts,!test.ts,!spec.js',
            description: 'Filter by file extensions or patterns. Use ! to exclude. Separate with commas'
        },
        {
            name: 'keywords',
            label: 'Filter by commit messages',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., fix,feature,test,docs',
            description: 'Filter by keywords in commit messages, separated by commas. Leave empty for all commits'
        },
        {
            name: 'minChanges',
            label: 'Minimum changes',
            type: 'number',
            min: 1,
            max: 100,
            defaultValue: 5,
            placeholder: 'e.g., 5',
            description: 'Minimum number of changes to consider a file'
        },
        {
            name: 'maxAuthors',
            label: 'Maximum authors',
            type: 'number',
            min: 1,
            max: 10,
            defaultValue: 2,
            placeholder: 'e.g., 2',
            description: 'Maximum number of unique authors for a file to be considered a dungeon'
        }
    ],
    generateCommand: (params) => `
echo "Creating temporary workspace..."
tmpdir=$(mktemp -d 2>/dev/null || mktemp -d -t 'tmpdir')
trap 'rm -rf "$tmpdir"' EXIT

echo "Getting list of files that match minimum changes..."
${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string, params.filePattern as string)} | \\
  grep -v "^$" | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  awk '$1 >= ${params.minChanges} {print $2}' > "$tmpdir/files"

echo "Analyzing author patterns..."
while IFS= read -r file; do
  [ ! -f "$file" ] && continue
  
  author_count=$(${createGitCommand.getAuthors("$file", params.timeWindow as string)} | \\
    sort | \\
    uniq | \\
    wc -l | \\
    tr -d '[:space:]')
  
  if [ "$author_count" -le ${params.maxAuthors} ]; then
    echo "\\nFile: $file"
    echo "Changes in last ${params.timeWindow}:"
    ${createGitCommand.getAuthorContributions("$file", params.timeWindow as string)} | \\
      awk '{
        count=$1
        author=$2
        for(i=3;i<=NF;i++) author=author " " $i
        printf "  %s: %d changes\\n", author, count
      }'
  fi
done < "$tmpdir/files"
`
};

export const dependencyMagnetPattern: PatternDefinition = {
    id: 'dependency-magnets',
    icon: Link,
    iconColor: '#8b5cf6',
    title: 'Dependency Magnets',
    description: 'Find files that frequently change together with other files',
    params: [
        {
            name: 'timeWindow',
            label: 'Time Window',
            type: 'select',
            options: ['1 month', '3 months', '6 months', '1 year', '2 years'],
            defaultValue: '6 months'
        },
        {
            name: 'filePattern',
            label: 'File patterns',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., js,ts,!test.ts,!spec.js',
            description: 'Filter by file extensions or patterns. Use ! to exclude. Separate with commas'
        },
        {
            name: 'keywords',
            label: 'Filter by commit messages',
            type: 'text',
            defaultValue: '',
            placeholder: 'e.g., fix,refactor,feat',
            description: 'Filter by keywords in commit messages, separated by commas. Leave empty for all commits'
        },
        {
            name: 'minCoChanges',
            label: 'Minimum co-changes',
            type: 'number',
            min: 2,
            max: 20,
            defaultValue: 3,
            placeholder: 'e.g., 3',
            description: 'Minimum number of files changed together to identify coupled changes'
        },
        {
            name: 'showRelated',
            label: 'Show related files',
            type: 'number',
            min: 1,
            max: 20,
            defaultValue: 5,
            placeholder: 'e.g., 5',
            description: 'Number of most frequently co-changed files to display'
        }
    ],
    generateCommand: (params) => `
echo "Creating temporary workspace..."
tmpdir=$(mktemp -d 2>/dev/null || mktemp -d -t 'tmpdir')
trap 'rm -rf "$tmpdir"' EXIT

echo "Defining helper function..."
get_related_files() {
  local target_file="$1"
  git log --since="${params.timeWindow} ago" --name-only --pretty=format:"%h" | \\
    grep -v "^$" | \\
    grep -v "^[a-f0-9]\\{7,\\}$" | \\
    grep -v "^$target_file$" | \\
    sort | \\
    uniq -c | \\
    sort -rn | \\
    head -${params.showRelated} | \\
    awk '{printf "  %d co-changes: %s\\n", $1, $2}'
}

echo "Finding files with frequent co-changes..."
${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string, params.filePattern as string)} | \\
  grep -v "^$" | \\
  grep -v "^[a-f0-9]\\{7,\\}$" | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  awk '$1 >= ${params.minCoChanges} {print $2}' > "$tmpdir/files"

echo "Analyzing dependencies..."
while IFS= read -r file; do
  [ ! -f "$file" ] && continue
  
  echo "\\nDependency Magnet: $file"
  echo "Related files:"
  get_related_files "$file"
done < "$tmpdir/files"
`
};

export const patterns = [
    hotspotPattern,
    dungeonPattern,
    dependencyMagnetPattern
] as const;
