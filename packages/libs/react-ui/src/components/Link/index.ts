import { ILinkProps, Link as LinkRoot } from './Link';
import { LinkIcon } from './LinkIcon';

import { FC } from 'react';

export { ILinkProps };

interface ILink {
  Root: FC<ILinkProps>;
  Icon: typeof LinkIcon;
}

export const Link: ILink = {
  Root: LinkRoot,
  Icon: LinkIcon,
};
