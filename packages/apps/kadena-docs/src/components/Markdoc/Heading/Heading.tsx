import { Heading, styled, SystemIcons } from '@kadena/react-components';

import { createSlug } from '@/utils';
import React, { FC } from 'react';

type TagTypes = 1 | 2 | 3 | 4;
interface IProp {
  as: TagTypes;
  children: string;
}

const StyledHeader = styled(Heading, {
  a: {
    opacity: 0,
    transition: 'opacity .3s ease',
  },
  '&:hover': {
    a: {
      opacity: 1,
    },
  },
});

const StyledLinkIcon = styled('a', {
  display: 'inline-block',
  paddingLeft: '$3',
});

export const TaggedHeading: FC<IProp> = ({ children, as }) => {
  const slug = createSlug(children);

  return (
    <StyledHeader as={as}>
      {children}
      <StyledLinkIcon id={slug} href={`#${slug}`}>
        <SystemIcons.Link />
      </StyledLinkIcon>
    </StyledHeader>
  );
};
