import { styled } from '@kadena/react-components';

import React, { FC } from 'react';

interface IProp {
  href: string;
  children: string;
}

const StyledLink = styled('a', {
  color: '$primary',
});

export const Link: FC<IProp> = ({ href, children }) => {
  return <StyledLink href={href}>{children}</StyledLink>;
};
