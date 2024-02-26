import { join } from 'node:path';
import type { CommonPreludeOptions, PactPrelude } from './types';

export async function resolvePreludes({
  contractsDir,
  preludes,
}: CommonPreludeOptions) {
  const preludesDir = join(process.cwd(), contractsDir as string, 'prelude');
  const uniquePreludes = [...new Set(preludes)];

  const resolved: PactPrelude[] = await Promise.all(
    uniquePreludes?.map((prelude) => {
      if (typeof prelude === 'string') {
        switch (prelude) {
          case 'kadena/chainweb':
            return import('./preludes/kadena/chainweb').then((m) => m.default);
          case 'kadena/marmalade':
            return import('./preludes/kadena/marmalade').then((m) => m.default);
          default:
            throw new Error(`Prelude ${prelude} not found`);
        }
      }
      return prelude;
    }) ?? [],
  );

  return { preludes: resolved, preludesDir };
}
