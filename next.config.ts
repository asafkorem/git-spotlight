/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/git-spotlight' : '',
    images: {
        unoptimized: true,
    },
    assetPrefix: process.env.NODE_ENV === 'production' ? '/git-spotlight' : '',
}

module.exports = nextConfig
