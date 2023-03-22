module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
        '\\.svg$': 'jest-svg-transformer',
      "^.+\\.css$": "jest-transform-css"
    },
    globals: {
      'ts-jest': {
        diagnostics: false,
        tsconfig: require.resolve('./tsconfig.json'),
      },
    },

    testRegex: 'S*.test.tsx?$',
    modulePathIgnorePatterns: ["./src/EduApp/*"],
    transformIgnorePatterns: [
      //"[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '@src(.*)$': '<rootDir>/src/$1',
        '@modules(.*)$': '<rootDir>/src/modules/$1',
        '@images(.*)$': '<rootDir>/config/jest/svgMock.js',
        "./webworker":"<rootDir>/config/jest/workerMock.js"
    },
  "moduleDirectories": [
    "node_modules",
    "src"
  ],
};
