import { styled } from '@kadena/react-components';

import { BodyText } from '@/components/Typography';
import React, { FC } from 'react';

interface IProp {
  children: string;
}

const StyledBodyText = styled(BodyText, {
  marginBottom: '$5',
});

export const Paragraph: FC<IProp> = ({ children }) => {
  return <StyledBodyText as="p">{children}</StyledBodyText>;
};
