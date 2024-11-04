export const createGitCommand = {
    createFileFilter: (filePattern: string) => {
        if (!filePattern) return '';

        const patterns = filePattern.split(',').map(p => p.trim());
        const includes = patterns.filter(p => !p.startsWith('!')).map(p => `\\.*${p}$`);
        const excludes = patterns.filter(p => p.startsWith('!')).map(p => `\\.*${p.slice(1)}$`);

        let grepCommand = '';
        if (includes.length) {
            grepCommand += ` | grep -E '${includes.join('|')}'`;
        }
        if (excludes.length) {
            grepCommand += ` | grep -Ev '${excludes.join('|')}'`;
        }
        return grepCommand;
    },

    countFileChanges: (timeWindow: string, keywords?: string, filePattern?: string) => {
        const grep = keywords ? ` --grep="${keywords.split(',').join('|')}" -i` : '';
        const fileFilter = createGitCommand.createFileFilter(filePattern || '');
        return `git log --since="${timeWindow} ago"${grep} --name-only --pretty=format:""${fileFilter}`;
    },

    getAuthors: (file: string, timeWindow: string) =>
        `git log --since="${timeWindow} ago" --pretty=format:"%an" -- "${file}" | sort -u`,

    getAuthorContributions: (file: string, timeWindow: string) =>
        `git log --since="${timeWindow} ago" --pretty=format:"%an" -- "${file}" | sort | uniq -c | sort -nr`
};
