import { ISection, Section } from './Section';

import React, { FC, FunctionComponentElement } from 'react';

interface IProps {
  children?:
    | FunctionComponentElement<ISection>[]
    | FunctionComponentElement<ISection>;
}

type BrowseSectionType = FC<IProps> & {
  Section: FC<ISection>;
};

const BrowseSection: BrowseSectionType = ({ children }) => {
  return (
    <section>
      <ul>{children}</ul>
    </section>
  );
};
BrowseSection.Section = Section;

export { BrowseSection };
