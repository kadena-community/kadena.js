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
        {Boolean(title) && <Heading as="h5">{title}</Heading>}
        <StyledList>
          {React.Children.map(children, (child) => {
            if (
              !React.isValidElement(child) ||
              (child.type !== LinkBlock && child.type !== LinkList)
            ) {
              throw new Error('not a child for the BrowseSection Component');
            }
            return child;
          })}
        </StyledList>
      </Stack>
    </StyledSection>
  );
};
BrowseSection.LinkBlock = LinkBlock;
BrowseSection.LinkList = LinkList;

export { BrowseSection };
