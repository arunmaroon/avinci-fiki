import type { WebpackConfigMutator } from '@teambit/webpack';

/**
 * modifies the webpack config for the components preview bundle.
 * @see https://bit.dev/reference/webpack/webpack-config
 */
export const webpackTransformer = (
  configMutator: WebpackConfigMutator
): WebpackConfigMutator => {
  configMutator.addModuleRule({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });
  return configMutator;
};
