import type { FC } from 'react';
import React from 'react';
import type { ILinkProps } from '../Link';
import { Link } from '../Link';

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
