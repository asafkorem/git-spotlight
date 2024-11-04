import { Flame, Skull, Link } from 'lucide-react';
import { PatternDefinition } from '@/types/git-patterns';
import { createGitCommand } from '@/utils/git-commands';

// Color constants for better readability
const COLORS = {
    reset: "\\033[0m",
    bold: "\\033[1m",
    dim: "\\033[2m",
    red: "\\033[31m",
    green: "\\033[32m",
    yellow: "\\033[33m",
    blue: "\\033[34m",
    magenta: "\\033[35m",
    cyan: "\\033[36m",
    white: "\\033[37m",
} as const;

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
            description: 'Filter by file extensions or paths. Use ! to exclude. Example: js,ts (all JS/TS files), src/*.js (JS in src), !test.ts (exclude test files)'
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
echo "${COLORS.cyan}⚡ Finding most frequently changed files...${COLORS.reset}"
result=$(${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string, params.filePattern as string)} | \\
  grep -v "^$" | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  head -${params.limit} | \\
  awk '{printf "    %d changes: %s\\n", $1, $2}')

if [ -z "$result" ]; then
  echo "${COLORS.yellow}No hotspots found matching your criteria${COLORS.reset}"
else
  count=$(echo "$result" | wc -l | tr -d ' ')
  echo "${COLORS.green}Found $count hotspots:${COLORS.reset}"
  echo "$result" | awk '{printf "%s%s%s\\n", "\\033[1m", $0, "\\033[0m"}'
fi
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
            description: 'Filter by file extensions or paths. Use ! to exclude. Example: js,ts (all JS/TS files), src/*.js (JS in src), !test.ts (exclude test files)'
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
echo "${COLORS.cyan}🏰 Initializing dungeon search...${COLORS.reset}"
tmpdir=$(mktemp -d 2>/dev/null || mktemp -d -t 'tmpdir')
trap 'rm -rf "$tmpdir"' EXIT

echo "${COLORS.blue}📊 Analyzing change patterns...${COLORS.reset}"
${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string, params.filePattern as string)} | \\
  grep -v "^$" | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  awk '$1 >= ${params.minChanges} {print $2}' > "$tmpdir/files"

if [ ! -s "$tmpdir/files" ]; then
  echo "${COLORS.yellow}No files found matching your criteria${COLORS.reset}"
  exit 0
fi

echo "${COLORS.blue}👥 Analyzing author patterns...${COLORS.reset}"
found_dungeons=0

while IFS= read -r file; do
  [ ! -f "$file" ] && continue
  
  author_count=$(${createGitCommand.getAuthors("$file", params.timeWindow as string)} | \\
    sort | \\
    uniq | \\
    wc -l | \\
    tr -d '[:space:]')
  
  if [ "$author_count" -le ${params.maxAuthors} ]; then
    found_dungeons=$((found_dungeons + 1))
    echo "\\n${COLORS.magenta}Dungeon found: ${COLORS.bold}$file${COLORS.reset}"
    echo "${COLORS.cyan}Changes in last ${params.timeWindow}:${COLORS.reset}"
    ${createGitCommand.getAuthorContributions("$file", params.timeWindow as string)} | \\
      awk '{
        count=$1
        author=$2
        for(i=3;i<=NF;i++) author=author " " $i
        printf "  %s%s: %d changes%s\\n", "\\033[1m", author, count, "\\033[0m"
      }'
  fi
done < "$tmpdir/files"

if [ "$found_dungeons" -eq 0 ]; then
  echo "${COLORS.yellow}No dungeons found matching your criteria${COLORS.reset}"
else
  echo "\\n${COLORS.green}Found $found_dungeons dungeons in total${COLORS.reset}"
fi
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
            description: 'Filter by file extensions or paths. Use ! to exclude. Example: js,ts (all JS/TS files), src/*.js (JS in src), !test.ts (exclude test files)'
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
echo "${COLORS.cyan}🧲 Initializing dependency analysis...${COLORS.reset}"
tmpdir=$(mktemp -d 2>/dev/null || mktemp -d -t 'tmpdir')
trap 'rm -rf "$tmpdir"' EXIT

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
    awk '{printf "  %s%d co-changes: %s%s\\n", "\\033[1m", $1, $2, "\\033[0m"}'
}

echo "${COLORS.blue}🔍 Finding frequently coupled files...${COLORS.reset}"
${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string, params.filePattern as string)} | \\
  grep -v "^$" | \\
  grep -v "^[a-f0-9]\\{7,\\}$" | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  awk '$1 >= ${params.minCoChanges} {print $2}' > "$tmpdir/files"

if [ ! -s "$tmpdir/files" ]; then
  echo "${COLORS.yellow}No dependency magnets found matching your criteria${COLORS.reset}"
  exit 0
fi

found_magnets=0
echo "${COLORS.blue}📊 Analyzing dependencies...${COLORS.reset}"
while IFS= read -r file; do
  [ ! -f "$file" ] && continue
  
  found_magnets=$((found_magnets + 1))
  echo "\\n${COLORS.magenta}Dependency Magnet: ${COLORS.bold}$file${COLORS.reset}"
  echo "${COLORS.cyan}Related files:${COLORS.reset}"
  get_related_files "$file"
done < "$tmpdir/files"

if [ "$found_magnets" -eq 0 ]; then
  echo "${COLORS.yellow}No dependency magnets found matching your criteria${COLORS.reset}"
else
  echo "\\n${COLORS.green}Found $found_magnets dependency magnets in total${COLORS.reset}"
fi
`
};

export const patterns = [
    hotspotPattern,
    dungeonPattern,
    dependencyMagnetPattern
] as const;
