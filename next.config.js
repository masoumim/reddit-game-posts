/** @type {import('next').NextConfig} */

// The images.remotePatterns array contains image sources that have been whitelisted.
// To cover all possible hosts, we just indicate a '*' which will match any host. 
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '*'
            },
            {
                protocol: 'https',
                hostname: '*'
            }
        ]
    }
}

module.exports = nextConfig
