import { Heading, Stack } from '@kadena/react-components';

import { ILinkBlock, LinkBlock } from './LinkBlock';
import { ILinkList, LinkList } from './LinkList';
import { StyledList, StyledSection } from './styles';

import React, { FC, FunctionComponentElement } from 'react';

interface IProps {
  title?: string;
  children?:
    | FunctionComponentElement<ILinkBlock>[]
    | FunctionComponentElement<ILinkBlock>
    | FunctionComponentElement<ILinkList>[]
    | FunctionComponentElement<ILinkList>;
}

type BrowseSectionType = FC<IProps> & {
  LinkBlock: FC<ILinkBlock>;
  LinkList: FC<ILinkList>;
};

const BrowseSection: BrowseSectionType = ({ children, title }) => {
  return (
    <StyledSection>
      <Stack direction="column">
        {title && <Heading as="h5">{title}</Heading>}
        <StyledList>{children}</StyledList>
      </Stack>
    </StyledSection>
  );
};
BrowseSection.LinkBlock = LinkBlock;
BrowseSection.LinkList = LinkList;

export { BrowseSection };
