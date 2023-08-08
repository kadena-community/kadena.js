import type { ILinkProps } from './Link';
import { Link as LinkRoot } from './Link';

import { FC } from 'react';

export type { ILinkProps };

export const Link: FC<ILinkProps> = LinkRoot;
