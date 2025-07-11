import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  rollup: {
    esbuild: {
      minify: true,
    },
  },
  declaration: true,
});
