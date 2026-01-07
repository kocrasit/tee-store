import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            // PRODUCTION: Localhost desteği sadece development için
            ...(process.env.NODE_ENV === 'development' ? [{
                protocol: 'http',
                hostname: 'localhost',
            }] : []),
            // Instagram CDN domains
            {
                protocol: 'https',
                hostname: '*.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: '*.cdninstagram.com',
            },
            {
                protocol: 'https',
                hostname: 'instagram.fsaw2-1.fna.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: 'scontent.cdninstagram.com',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
            // Backend upload domain (Render veya diğer hosting)
            ...(process.env.NEXT_PUBLIC_API_URL ? [{
                protocol: 'https',
                hostname: new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
            }] : []),
        ],
    },
    // PRODUCTION: Compiler optimizations
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },
    // PRODUCTION: Output standalone for better performance
    output: 'standalone',
};

// Sentry configuration
const sentryWebpackPluginOptions = {
    // Suppress source map upload errors in development
    silent: !process.env.CI,

    // Organization and project from Sentry
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Auth token for uploading source maps
    authToken: process.env.SENTRY_AUTH_TOKEN,

    // Upload source maps only in production
    widenClientFileUpload: true,

    // Hide source maps from client
    hideSourceMaps: true,

    // Disable logger in production
    disableLogger: true,
};

// Only wrap with Sentry if DSN is configured
const exportedConfig = process.env.NEXT_PUBLIC_SENTRY_DSN
    ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
    : nextConfig;

export default exportedConfig;
