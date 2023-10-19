/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'i.imgur.com',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
            }

        ]
    }
}

module.exports = nextConfig
