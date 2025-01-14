import path from 'path'
import withBundleAnalyzer from '@next/bundle-analyzer'
import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  workboxOptions: {
    mode: 'production',
  },
  reloadOnOnline: false,
  /* Do not precache anything */
  publicExcludes: ['**/*'],
  buildExcludes: [/./],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // static site export

  trailingSlash: true, // IPFS support

  images: {
    unoptimized: true,
  },

  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  eslint: {
    dirs: ['src'],
  },
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'lodash',
      'date-fns',
      '@sentry/react',
      '@gnosis.pm/zodiac',
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: false,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false },
                  },
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    })

    config.resolve.alias = {
      ...config.resolve.alias,
      'bn.js': path.resolve('./node_modules/bn.js/lib/bn.js'),
      'mainnet.json': path.resolve('./node_modules/@ethereumjs/common/dist.browser/genesisStates/mainnet.json'),
    }

    return config
  },
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(withPWA(nextConfig))
