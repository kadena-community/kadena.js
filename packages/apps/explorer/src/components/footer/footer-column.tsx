import { Heading, Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import FooterLink from './footer-link';
import { isClosedClass } from './style.css';

interface IProps {
  data: IMenuConfigItem;
  isOpen?: boolean;
}

const FooterColumn: FC<IProps> = ({ data, isOpen }) => {
  return (
    <Stack
      className={classNames({
        [isClosedClass]: !isOpen,
      })}
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
