import { Flame, Skull, Link } from 'lucide-react';
import { PatternDefinition, ParamConfig } from '@/types/git-patterns';
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

const commonParams: Record<string, ParamConfig> = {
    timeWindow: {
        name: 'timeWindow',
        label: 'Time Window',
        type: 'select' as const,
        options: ['1 month', '3 months', '6 months', '1 year', '2 years'],
        defaultValue: '6 months'
    },
    filePattern: {
        name: 'filePattern',
        label: 'File patterns',
        type: 'text' as const,
        defaultValue: '',
        placeholder: 'e.g., js,ts,!test.ts,!spec.js',
        description: 'Filter by file extensions or paths. Use ! to exclude. Example: js,ts (all JS/TS files), src/*.js (JS in src), !test.ts (exclude test files)'
    },
    keywords: {
        name: 'keywords',
        label: 'Filter by commit messages',
        type: 'text' as const,
        defaultValue: '',
        placeholder: 'e.g., fix,bug,hotfix,patch',
        description: 'Filter by keywords in commit messages, separated by commas. Leave empty for all commits'
    },
    topResults: {
        name: 'topResults',
        label: 'Show top results',
        type: 'number' as const,
        min: 5,
        max: 50,
        defaultValue: 10,
        placeholder: 'e.g., 10',
        description: 'Number of top results to display'
    }
} as const;

export const hotspotPattern: PatternDefinition = {
    id: 'hotspots',
    icon: Flame,
    iconColor: '#bd2424',
    title: 'Hotspots️',
    description: 'Track frequently changing files that might need attention',
    params: [
        commonParams.timeWindow,
        commonParams.filePattern,
        commonParams.keywords,
        commonParams.topResults
    ],
    generateCommand: (params) => `
echo "${COLORS.cyan}⚡ Finding most frequently changed files...${COLORS.reset}"
result=$(${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string, params.filePattern as string)} | \\
  grep -v "^$" | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  head -${params.topResults} | \\
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
        commonParams.timeWindow,
        commonParams.filePattern,
        commonParams.keywords,
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
        },
        commonParams.topResults
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
  awk '$1 >= ${params.minChanges} {print $1, $2}' > "$tmpdir/files"

if [ ! -s "$tmpdir/files" ]; then
  echo "${COLORS.yellow}No files found matching your criteria${COLORS.reset}"
  exit 0
fi

echo "${COLORS.blue}👥 Analyzing author patterns...${COLORS.reset}"
found_dungeons=0

while IFS= read -r line; do
  changes=$(echo "$line" | awk '{print $1}')
  file=$(echo "$line" | awk '{print $2}')
  [ ! -f "$file" ] && continue
  
  author_count=$(${createGitCommand.getAuthors("$file", params.timeWindow as string)} | \\
    sort | \\
    uniq | \\
    wc -l | \\
    tr -d '[:space:]')
  
  if [ "$author_count" -le ${params.maxAuthors} ]; then
    found_dungeons=$((found_dungeons + 1))
    if [ "$found_dungeons" -le ${params.topResults} ]; then
      echo "\\n${COLORS.magenta}Dungeon found: ${COLORS.bold}$file${COLORS.reset}"
      echo "${COLORS.cyan}Changes in last ${params.timeWindow}: ${COLORS.bold}$changes${COLORS.reset}"
      echo "${COLORS.cyan}Authors:${COLORS.reset}"
      ${createGitCommand.getAuthorContributions("$file", params.timeWindow as string)} | \\
        awk '{
          count=$1
          author=$2
          for(i=3;i<=NF;i++) author=author " " $i
          printf "  %s%s: %d changes%s\\n", "\\033[1m", author, count, "\\033[0m"
        }'
    fi
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
        commonParams.timeWindow,
        commonParams.filePattern,
        commonParams.keywords,
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
        },
        commonParams.topResults
    ],
    generateCommand: (params) => `
echo "${COLORS.cyan}🧲 Initializing dependency analysis...${COLORS.reset}"
tmpdir=$(mktemp -d 2>/dev/null || mktemp -d -t 'tmpdir')
trap 'rm -rf "$tmpdir"' EXIT

get_related_files() {
  local target_file="$1"
  
  echo "${COLORS.dim}Finding commits for $target_file...${COLORS.reset}" >&2
  local target_commits=$(git log --follow --since="${params.timeWindow} ago" --pretty="format:%H" -- "$target_file")
  
  echo "${COLORS.dim}Analyzing co-changes...${COLORS.reset}" >&2
  echo "$target_commits" | while read -r commit; do
    git diff-tree --no-commit-id --name-only -r $commit | grep -v "^$target_file$"
  done | \\
    grep -v "^$" | \\
    sort | \\
    uniq -c | \\
    sort -rn | \\
    head -${params.showRelated} | \\
    tee "$tmpdir/cochanges_\${target_file//\\//_}" | \\
    awk '{printf "  %s%d co-changes: %s%s\\n", "\\033[1m", $1, $2, "\\033[0m"}'
}

get_total_cochanges() {
  local file="$1"
  awk '{sum += $1} END {print sum}' "$tmpdir/cochanges_\${file//\\//_}" 2>/dev/null || echo 0
}

echo "${COLORS.blue}🔍 Finding frequently coupled files...${COLORS.reset}"
${createGitCommand.countFileChanges(params.timeWindow as string, params.keywords as string, params.filePattern as string)} | \\
  grep -v "^$" | \\
  grep -v "^[a-f0-9]\\{7,\\}$" | \\
  sort | \\
  uniq -c | \\
  sort -rn | \\
  awk '$1 >= ${params.minCoChanges} {print $2}' > "$tmpdir/candidates"

if [ ! -s "$tmpdir/candidates" ]; then
  echo "${COLORS.yellow}No dependency magnets found matching your criteria${COLORS.reset}"
  exit 0
fi

echo "${COLORS.blue}📊 Analyzing dependencies...${COLORS.reset}"
# First pass: collect co-changes data
while IFS= read -r file; do
  [ ! -f "$file" ] && continue
  get_related_files "$file" >/dev/null
done < "$tmpdir/candidates"

echo "${COLORS.blue}🔍 Analyzing results...${COLORS.reset}"
found_magnets=0
while IFS= read -r file; do
  [ ! -f "$file" ] && continue
  total_cochanges=$(get_total_cochanges "$file")
  echo "$total_cochanges $file"
done < "$tmpdir/candidates" | \\
  sort -rn | \\
  head -${params.topResults} | \\
  while IFS= read -r line; do
    file=$(echo "$line" | cut -d' ' -f2-)
    total=$(echo "$line" | cut -d' ' -f1)
    found_magnets=$((found_magnets + 1))
    echo "\\n${COLORS.magenta}Dependency Magnet: ${COLORS.bold}$file${COLORS.reset}"
    echo "${COLORS.cyan}Total co-changes: ${COLORS.bold}$total${COLORS.reset}"
    echo "${COLORS.cyan}Related files:${COLORS.reset}"
    cat "$tmpdir/cochanges_\${file//\\//_}"
  done

if [ "$found_magnets" -eq 0 ]; then
  echo "${COLORS.yellow}No dependency magnets found matching your criteria${COLORS.reset}"
else
  echo "\\n${COLORS.green}Found $found_magnets dependency magnets with highest coupling${COLORS.reset}"
fi
`
};

export const patterns = [
    hotspotPattern,
    dungeonPattern,
    dependencyMagnetPattern
] as const;
