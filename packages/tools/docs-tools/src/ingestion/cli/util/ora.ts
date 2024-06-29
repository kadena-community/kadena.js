import type { Options, Ora } from 'ora';
import { default as _ora } from 'ora';

const ora = function (options?: string | Options): Ora {
  return _ora(options);
};

export default ora;
