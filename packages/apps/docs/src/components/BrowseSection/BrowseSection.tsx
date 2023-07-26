import { Heading, IHeadingProps } from '@kadena/react-ui';

import { ILinkBlock, LinkBlock } from './LinkBlock';
import { ILinkList, LinkList } from './LinkList';
import { StyledLinkList, StyledList, StyledSection } from './styles';

import Link from 'next/link';
import React, { FC, FunctionComponentElement } from 'react';

export interface IBrowseSectionProps {
  title?: string;
  titleAs?: IHeadingProps['as'];
  children?:
    | FunctionComponentElement<ILinkBlock>[]
    | FunctionComponentElement<ILinkBlock>;
  direction?: 'column' | 'row';
  className?: string;
}

export type BrowseSectionType = FC<IBrowseSectionProps> & {
  LinkBlock: FC<ILinkBlock>;
  LinkList: FC<ILinkList>;
};

const BrowseSection: BrowseSectionType = ({
  /* eslint-disable react/prop-types */
  children,
  title,
  titleAs = 'h6',
  direction = 'column',
  className,
  /* eslint-enable react/prop-types */
}) => {
  const Wrapper = direction === 'column' ? StyledLinkList : StyledList;

  return (
    <StyledSection direction={direction} className={className}>
      {Boolean(title) && <Heading as={titleAs}>{title}</Heading>}
      <Wrapper>
        {React.Children.map(children, (child) => {
          if (
            !React.isValidElement(child) ||
            (child.type !== LinkBlock &&
              child.type !== Link &&
              child.type !== 'a')
          ) {
            throw new Error('not a child for the BrowseSection Component');
          }
          if (child.type === LinkBlock) {
            return child;
          }

          return <li>{child}</li>;
        })}
      </Wrapper>
    </StyledSection>
  );
};

BrowseSection.LinkBlock = LinkBlock;
BrowseSection.LinkList = LinkList;

export { BrowseSection };
