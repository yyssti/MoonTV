/** @type {import('next').NextConfig} */
/* eslint-disable @typescript-eslint/no-var-requires */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  output: 'standalone',
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true, // 开启严格模式
  swcMinify: true,

  images: {
    formats: ['image/avif', 'image/webp'], // 自动生成现代格式
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
    // ❌ 不要加 unoptimized: true，否则自动生成 blurDataURL 和优化会失效
  },

  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // *.svg?url 保持原文件输出
      { ...fileLoaderRule, test: /\.svg$/i, resourceQuery: /url/ },
      // 其余 svg 转 React Component
      {
        test: /\.svg$/i,
        issuer: { not: /\.(css|scss|sass)$/ },
        resourceQuery: { not: /url/ },
        loader: '@svgr/webpack',
        options: { dimensions: false, titleProp: true },
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      crypto: false,
    };

    return config;
  },
};

module.exports = withPWA(nextConfig);
