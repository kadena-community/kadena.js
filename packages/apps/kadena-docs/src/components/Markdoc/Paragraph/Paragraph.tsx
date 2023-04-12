import { Text } from '@kadena/react-components';

import React, { FC } from 'react';

interface IProp {
  children: string;
}

export const Paragraph: FC<IProp> = ({ children }) => {
  return <Text as="p">{children}</Text>;
};
