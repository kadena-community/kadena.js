import { createConsola } from 'consola';

export const logger = createConsola({
  level: 4,
  formatOptions: {
    columns: 80,
    colors: false,
    compact: false,
    date: false,
  },
});
