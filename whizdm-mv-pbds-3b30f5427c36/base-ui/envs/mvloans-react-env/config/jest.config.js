/**
 * @see https://bit.dev/reference/jest/jest-config
 */
const { jestConfig } = require('@teambit/react.react-env');
const {
  generateNodeModulesPattern,
} = require('@teambit/dependencies.modules.packages-excluder');

const packagesToExclude = ['@mvloans'];

/**
 * by default, jest excludes all node_modules from the transform (compilation) process.
 * the following config excludes all node_modules, except for Bit components, style modules, and the packages that are listed.
 */
module.exports = {
  ...jestConfig,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 10,
    },
  },
  transformIgnorePatterns: [
    '^.+.module.(css|sass|scss)$',
    generateNodeModulesPattern({
      packages: packagesToExclude,
      excludeComponents: true,
    }),
  ],
  moduleNameMapper: {
    '\\.(woff|woff2)$': [require.resolve('./file-mock.js')],
  },
};
