/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Remove a resolução específica do WalletConnect
    return config;
  },
  experimental: {
    esmExternals: true, // Alterado para true
  },
};

module.exports = nextConfig;
