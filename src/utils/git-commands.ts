export const createGitCommand = {
    createFileFilter: (filePattern: string) => {
        if (!filePattern) return '';

        const patterns = filePattern.split(',').map(p => p.trim());
        const includes = patterns
            .filter(p => !p.startsWith('!'))
            .map(p => p.includes('/') ? p : `\\.${p}$`);
        const excludes = patterns
            .filter(p => p.startsWith('!'))
            .map(p => {
                const pattern = p.slice(1);
                return pattern.includes('/') ? pattern : `\\.${pattern}$`;
            });

        let grepCommand = '';
        if (includes.length) {
            grepCommand += ` | grep -e '${includes.join('\\|')}'`;
        }
        if (excludes.length) {
            grepCommand += ` | grep -v -e '${excludes.join('\\|')}'`;
        }
        return grepCommand;
    },

    countFileChanges: (timeWindow: string, keywords?: string, filePattern?: string) => {
        const grepKeywords = keywords
            ? ` --grep='${keywords.split(',').map(k => k.trim()).join('\\|')}' -i`
            : '';
        const fileFilter = createGitCommand.createFileFilter(filePattern || '');
        return `git log${grepKeywords} --since="${timeWindow} ago" --name-only --pretty="format:"${fileFilter}`;
    },

    getAuthors: (file: string, timeWindow: string) =>
        `git log --follow --since="${timeWindow} ago" --pretty="format:%an" -- "${file}" | sort -u`,

    getAuthorContributions: (file: string, timeWindow: string) =>
        `git log --follow --since="${timeWindow} ago" --pretty="format:%an" -- "${file}" | sort | uniq -c | sort -nr`
};
