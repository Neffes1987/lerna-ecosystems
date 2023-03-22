module.exports = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-typescript',
    'proposal-typescript',
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
        targets: {
          browsers: ['last 1 version'],
        },
      },
    ],
  ],
  env: {
    development: {
      plugins: ['react-hot-loader/babel'],
    },
    test: {
      plugins: ['babel-plugin-import-remove-resource-query', '@babel/plugin-transform-modules-commonjs'],
    },
  },
  plugins: [
    'ts-optchain',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    'dynamic-import-webpack',
    'lodash',
    'ramda',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    ['@babel/plugin-proposal-class-properties', {
      loose: true
    }],
    ['@babel/plugin-proposal-private-methods', {
      loose: true
    }],
    ['@babel/plugin-proposal-private-property-in-object', {
      loose: true
    }],
    [
      'babel-plugin-styled-components',
      {
        ssr: false,
        displayName: true,
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
};
