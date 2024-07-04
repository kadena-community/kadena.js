import { Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React from 'react';
import FooterLink from './footer-link';

interface IProps {
  data: IMenuConfigItem;
  isOpen?: boolean;
}

const FooterColumn: FC<IProps> = ({ data, isOpen }) => {
  return (
    <Stack
      style={{ display: isOpen ? 'flex' : 'none' }}
      flex={1}
      marginBlock="sm"
      flexDirection="column"
      gap="sm"
      marginInlineEnd="md"
    >
      <Heading as="h6">{data.label}</Heading>
      {data.children.map((item) => (
        <FooterLink key={item.url} href={item.url}>
          {item.label}
        </FooterLink>
      ))}
    </Stack>
  );
};

export default FooterColumn;
