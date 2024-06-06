import {
  defineConfig,
  pathToStyleName,
  responsiveExtension,
} from '@design-sync/cli';
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
      styleName: ({ path }) => {
        // const cleanPath = path.split('font')[1];
        // console.log(pathToStyleName(cleanPath, { count: 4 }));
        return pathToStyleName(path, { count: 4 });
      },
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
  prettify: true,
});
