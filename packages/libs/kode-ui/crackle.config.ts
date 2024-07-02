import { defineConfig } from '@crackle/cli/config';

export default defineConfig({
  package: {
    clean: true,
    fix: true,
    mode: 'preserve',
  },
});
