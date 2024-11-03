/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/git-spotlight', // Should match your repository name
    images: {
        unoptimized: true,
    },
}

module.exports = nextConfig
