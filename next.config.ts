import type { NextConfig } from "next";

const normalizeAuthProxyTarget = (target?: string) => {
  if (!target) return null;
  const trimmed = target.replace(/\/$/, "");
  return trimmed.endsWith("/api/auth") ? trimmed : `${trimmed}/api/auth`;
};

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
        pathname: '/**'
      }
    ]
  },
  async rewrites() {
    const authProxyTarget = normalizeAuthProxyTarget(process.env.BETTER_AUTH_URL);
    if (!authProxyTarget) {
      return [];
    }
    return [
      {
        source: "/api/auth/:path*",
        destination: `${authProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
