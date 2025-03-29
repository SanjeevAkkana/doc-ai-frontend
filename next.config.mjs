/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
        ],
    },
    webpack: (config) => {
        config.experiments = { asyncWebAssembly: true, layers: true };
        return config;
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

export default nextConfig;  