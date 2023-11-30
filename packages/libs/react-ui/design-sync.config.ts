import { defineConfig, responsiveExtension } from '@design-sync/cli';
import { vanillaExtractPlugin } from '@design-sync/vanilla-extract-plugin';

const breakpoints = {
  xs: '{kda.foundation.breakpoint.xs}',
  sm: '{kda.foundation.breakpoint.sm}',
  md: '{kda.foundation.breakpoint.md}',
  lg: '{kda.foundation.breakpoint.lg}',
  xl: '{kda.foundation.breakpoint.xl}',
  xxl: '{kda.foundation.breakpoint.xxl}',
};

const breakpointKeys = Object.keys(breakpoints);
// const fontOverride = () => "'Haas Grotesk Display', -apple-system, sans-serif";

export default defineConfig({
  // you can switch to different branch by changing the #main to #branch-name
  uri: 'github:kadena-community/design-system/tokens#main',
  out: 'src/styles/tokens',
  defaultMode: 'light',
  requiredModes: ['light', 'dark'],
  plugins: [
    vanillaExtractPlugin({
      contractName: 'tokens',
      onlyValues: true,
    }),
  ],
  schemaExtensions: [
    responsiveExtension({
      breakpoints,
      filter: ([path, token]) =>
        token.$type === 'typography' &&
        breakpointKeys.some((key) => path.endsWith(key)),
    }),
  ],
  // TODO: Workaround different font names in figma and google fonts
  // overrides: {
  //   'kda.foundation.typography.family.bodyFont': fontOverride,
  //   'kda.foundation.typography.family.primaryFont': fontOverride,
  //   'kda.foundation.typography.family.headingFont': fontOverride,
  // },
  prettify: true,
});
