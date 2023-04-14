import {
  Heading,
  styled,
  StyledComponent,
  SystemIcons,
} from '@kadena/react-components';

import { createSlug } from '@/utils';
import React, { FC } from 'react';

type TagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface IProp {
  as: TagType;
  children: string;
}

const StyledHeader: StyledComponent<typeof Heading, { as?: TagType }> = styled(
  Heading,
  {
    a: {
      opacity: 0,
      transition: 'opacity .3s ease',
    },
    '&:hover': {
      a: {
        opacity: 1,
      },
    },
  },
);

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
