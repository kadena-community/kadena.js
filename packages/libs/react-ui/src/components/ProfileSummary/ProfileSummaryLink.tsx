import type { ILinkProps } from '@components/Link';
import { Link } from '@components/Link';
import type { FC } from 'react';
import React from 'react';

export interface IProfileSummaryLinkProps extends ILinkProps {}

export const ProfileSummaryLink: FC<IProfileSummaryLinkProps> = ({
  children,
  ...restLinkProps
}) => {
  return (
    <li>
      <Link {...restLinkProps}>{children}</Link>
    </li>
  );
};
