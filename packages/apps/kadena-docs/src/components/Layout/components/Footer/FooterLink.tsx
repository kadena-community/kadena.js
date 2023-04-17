import { styled, Text } from '@kadena/react-components';

import React, { FC, ReactNode } from 'react';

interface IProps {
  children?: ReactNode;
  href: string;
}

const StyledLink = styled('a', {
  textDecoration: 'none',
  color: '$neutral4',
  padding: '0 $3',
  '&:hover': {
    textDecoration: 'underline',
    color: '$neutral5',
  },
});

export const FooterLink: FC<IProps> = ({ children, href }) => {
  return (
    <StyledLink href={href}>
      <Text size="md" bold={false}>
        {children}
      </Text>
    </StyledLink>
  );
};
