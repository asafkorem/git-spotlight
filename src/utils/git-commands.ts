export const createGitCommand = {
    countFileChanges: (timeWindow: string, keywords?: string) => {
        const grep = keywords ? ` --grep="${keywords.split(',').join('|')}" -i` : '';
        return `git log --since="${timeWindow} ago"${grep} --name-only --pretty=format:`;
    },

    getAuthors: (file: string, timeWindow: string) =>
        `git log --since="${timeWindow} ago" --pretty=format:"%an" -- "${file}" | sort -u`,

    getAuthorContributions: (file: string, timeWindow: string) =>
        `git log --since="${timeWindow} ago" --pretty=format:"%an" -- "${file}" | sort | uniq -c | sort -nr`
};
