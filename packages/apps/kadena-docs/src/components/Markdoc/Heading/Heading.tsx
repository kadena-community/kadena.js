import { styled, SystemIcons } from '@kadena/react-components';

import { IHeadingLevelProps } from '@/components';
import * as Headers from '@/components/Typography/Headers';
import { createSlug } from '@/utils';
import React, { FC } from 'react';

type TagTypes = 1 | 2 | 3 | 4;
interface IProp {
  as: TagTypes;
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
  scrollMarginTop: '$20',
  scrollSnapMarginTop: '$20',
});

const chooseHeader = (as: TagTypes): FC<IHeadingLevelProps> => {
  return Headers[`HeadingLevel${as}`];
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
