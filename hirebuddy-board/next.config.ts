import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /05-versions-space\.pdf$/,
      use: 'null-loader',
    });

    return config;
  },
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;