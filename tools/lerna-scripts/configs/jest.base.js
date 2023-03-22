const path = require('path');
const fs = require('fs');

const { pathsToModuleNameMapper } = require('ts-jest/utils');

/** Базовый конфиг jest: используется
 *  1) в root директории uikit (возможность запускать тесты локально через команду jest)
 *  2) в root каждого пакета (возможность запускать тесты через lerna (test))
 */
function getConfig() {
  const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf-8'));
  const babelConfigPath = require.resolve('./babel.config.js');
  const fileTransformerPath = require.resolve('./jest-file-transformer.js');

  const mapper =
    tsConfig && tsConfig.compilerOptions && tsConfig.compilerOptions.paths
      ? pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/' })
      : {};

  const options = {
    setupFiles: ['jest-canvas-mock', 'jest-fetch-mock'],
    setupFilesAfterEnv: [
      '@testing-library/jest-dom/extend-expect',
      'jest-styled-components',
      require.resolve('./jest-match-media-mock.js'),
      require.resolve('./jest-intersection-observer-mock.js'),
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    moduleNameMapper: {
      '\\.(css)$': 'identity-obj-proxy',
      '^dnd-core$': 'dnd-core/dist/cjs',
      '^react-dnd$': 'react-dnd/dist/cjs',
      '^react-dnd-html5-backend$': 'react-dnd-html5-backend/dist/cjs',
      '^react-dnd-touch-backend$': 'react-dnd-touch-backend/dist/cjs',
      '^react-dnd-test-backend$': 'react-dnd-test-backend/dist/cjs',
      '^react-dnd-test-utils$': 'react-dnd-test-utils/dist/cjs',
      ...mapper,
    },
    testPathIgnorePatterns: ['/node_modules/', 'build', '/__tests__/mocks/.*'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': ['babel-jest', { configFile: babelConfigPath }],
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${fileTransformerPath}`,
    },
    testMatch: ['**/__tests__/*test.(ts|tsx|js)'],
    globals: {
      'ts-jest': {
        isolatedModules: true,
        diagnostics: false,
        tsconfig: path.resolve('tsconfig.json'),
        babelConfig: babelConfigPath,
      },
      'babel-jest': {
        isolatedModules: true,
        babelConfig: babelConfigPath,
      },
    },
  };

  return Object.assign(options);
}

module.exports = getConfig();
