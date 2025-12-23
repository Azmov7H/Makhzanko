import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Experimental features for Next.js 16
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'recharts'],
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Logging configuration for development
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Strict TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
