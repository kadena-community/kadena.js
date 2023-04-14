import { styled, SystemIcons } from '@kadena/react-components';

import {
  HeadingLevel1,
  HeadingLevel2,
  HeadingLevel3,
  HeadingLevel4,
} from '@/components';
import { TagNameType } from '@/types/Layout';
import { createSlug } from '@/utils';
import React, { FC } from 'react';

interface IProp {
  as: TagNameType;
  children: string;
}

const StyleHover = styled('span', {
  background: 'green',
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

const chooseHeader = (as: string): FC => {
  switch (as) {
    case 'h1':
      return HeadingLevel1;
    case 'h2':
      return HeadingLevel2;
    case 'h3':
      return HeadingLevel3;
    case 'h4':
      return HeadingLevel4;
    default:
      return HeadingLevel2;
  }
};

export const TaggedHeading: FC<IProp> = ({ children, as }) => {
  const slug = createSlug(children);
  const Heading = chooseHeader(as);

  return (
    <StyleHover>
      <Heading>
        {children}
        <StyledLinkIcon id={slug} href={`#${slug}`}>
          <SystemIcons.Link />
        </StyledLinkIcon>
      </Heading>
    </StyleHover>
  );
};
