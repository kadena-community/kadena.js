import { BrowseSectionType } from './BrowseSection';
import { StyledBrowseSection } from './styles';

import React from 'react';

const LinkBrowseSection: BrowseSectionType = ({
  /* eslint-disable react/prop-types */
  title,
  titleAs,
  children,
  direction,
  /* eslint-enable react/prop-types */
}): React.JSX.Element => {
  return (
    <StyledBrowseSection title={title} titleAs={titleAs} direction={direction}>
      {children}
    </StyledBrowseSection>
  );
};

export { LinkBrowseSection };
