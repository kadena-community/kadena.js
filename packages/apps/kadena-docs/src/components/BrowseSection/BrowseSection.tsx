import { Heading, Stack } from '@kadena/react-components';

import { ISection, Section } from './Section';
import { StyledList, StyledSection } from './styles';

import React, { FC, FunctionComponentElement } from 'react';

interface IProps {
  title?: string;
  children?:
    | FunctionComponentElement<ISection>[]
    | FunctionComponentElement<ISection>;
}

type BrowseSectionType = FC<IProps> & {
  Section: FC<ISection>;
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
BrowseSection.Section = Section;

export { BrowseSection };
