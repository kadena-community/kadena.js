import { styled } from '@kadena/react-components';

import React, { FC } from 'react';

const StyledFooter = styled('footer', {
  position: 'relative',
  gridArea: 'footer',
  zIndex: '$menu',
  background: 'red',
});

export const Footer: FC = () => {
  return <StyledFooter>footer</StyledFooter>;
};
