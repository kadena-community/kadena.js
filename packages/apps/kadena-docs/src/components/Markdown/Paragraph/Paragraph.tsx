import { styled } from '@kadena/react-components';

import { BodyText } from '@/components/Typography';
import React, { FC } from 'react';

interface IProp {
  children: string;
}

const StyledBodyText = styled(BodyText, {
  margin: '$5 0',
});

export const Paragraph: FC<IProp> = ({ children }) => {
  return <StyledBodyText as="p">{children}</StyledBodyText>;
};
