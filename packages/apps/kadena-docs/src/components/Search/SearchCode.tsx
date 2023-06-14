import {
  StyledCode,
  StyledCodeWrapper,
  StyledInlineCode,
} from './../Markdown/Code/styles';

import React from 'react';
import type { Components } from 'react-markdown';

export const SearchCode: Components['code'] = ({ children, inline }) => {
  if (inline !== undefined) {
    return <StyledInlineCode>{children}</StyledInlineCode>;
  }

  return (
    <StyledCodeWrapper data-language="pact" data-theme="light">
      <StyledCode data-line-numbers-max-digits="3">{children}</StyledCode>
    </StyledCodeWrapper>
  );
};
