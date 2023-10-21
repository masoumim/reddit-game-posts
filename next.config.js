/** @type {import('next').NextConfig} */

// The images.remotePatterns array contains image sources that have been whitelisted.
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'i.imgur.com'
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com'
            },
            {
                protocol: 'http',
                hostname: 'i.redd.it'
            },
            {
                protocol: 'https',
                hostname: 'i.redd.it'
            }
        ]
    }
}

module.exports = nextConfig
