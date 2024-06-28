import { Heading, Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

interface IProps extends PropsWithChildren {
  title: string;
}

const FooterColumn: FC<IProps> = ({ children, title }) => {
  return (
    <Stack
      flex={1}
      marginBlock="sm"
      flexDirection="column"
      gap="sm"
      marginInlineEnd="md"
    >
      <Heading as="h6">{title}</Heading>
      {children}
    </Stack>
  );
};

export default FooterColumn;
