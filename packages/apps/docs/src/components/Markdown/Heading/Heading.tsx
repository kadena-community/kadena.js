import { styled, StyledComponent, SystemIcons } from '@kadena/react-components';
import { Heading } from '@kadena/react-ui';

import { createSlug } from '@/utils';
import React, { FC, ReactElement } from 'react';

type TagType = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
interface IProp {
  as: TagType;
  variant?: TagType;
  children: ReactElement[];
  index?: number;
  parentTitle?: string;
}

export interface IHeader {
  children: string;
}

const StyledHeader: StyledComponent<
  typeof Heading,
  { as?: TagType; variant?: TagType }
> = styled(Heading, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  a: {
    opacity: 0,
    transition: 'opacity .3s ease',
  },
  '&:hover': {
    a: {
      opacity: 1,
    },
  },
  defaultVariants: {
    variant: 'h2',
  },
  variants: {
    variant: {
      h1: {
        fontSize: '$3xl',
      },
      h2: {
        fontSize: '$2xl',
      },
      h3: {
        fontSize: '$xl',
      },
      h4: {
        fontSize: '$lg',
      },
      h5: {
        fontSize: '$md',
      },
      h6: {
        fontSize: '$base',
      },
    },
  },
});

const StyledLinkIcon = styled('a', {
  display: 'inline-block',
  paddingLeft: '$3',
  scrollMarginTop: '$20',
  scrollSnapMarginTop: '$20',
});

export const TaggedHeading: FC<IProp> = ({
  children,
  as,
  variant,
  index,
  parentTitle,
}) => {
  let slugInputStr = '';

  if (Array.isArray(children)) {
    slugInputStr = children
      .map((child) => {
        if (typeof child === 'string') {
          return (child as string).trim();
        } else if (
          typeof child === 'object' &&
          typeof child.props?.children === 'string'
        ) {
          return child.props.children.trim();
        }
        return '';
      })
      .join(' ');
  } else {
    slugInputStr = children;
  }

  const slug = createSlug(slugInputStr, index, parentTitle);

  return (
    <StyledHeader as={as} variant={variant ?? as}>
      {children}
      <StyledLinkIcon id={slug} href={`#${slug}`}>
        <SystemIcons.Link />
      </StyledLinkIcon>
    </StyledHeader>
  );
};
