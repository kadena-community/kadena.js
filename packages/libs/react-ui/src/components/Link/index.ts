import { FC } from 'react';
import { Link as LinkRoot, ILinkProps } from './Link';

import { LinkIcon, ILinkIconProps } from './LinkIcon';

export { ILinkProps, ILinkIconProps };

interface ILink {
  Root: FC<ILinkProps>;
  Icon: FC<ILinkIconProps>;
}

export const Link: ILink = {
  Root: LinkRoot,
  Icon: LinkIcon,
};
