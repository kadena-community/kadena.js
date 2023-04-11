import { Heading, Icons, styled } from '@kadena/react-components';

import { TagNameType } from '@/types/Layout';
import { createSlug } from '@/utils';
import React, { FC } from 'react';

interface IProp {
  as: TagNameType;
  children: string;
}

const StyleHeader = styled(Heading, {
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
    <StyleHeader as={as}>
      {children}
      <StyledLinkIcon id={slug} href={`#${slug}`}>
        <Icons.LinkIcon />
      </StyledLinkIcon>
    </StyleHeader>
  );
};
