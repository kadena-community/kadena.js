import { Heading, Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import { FooterLink } from './FooterLink';
import { footerColumnClass, isClosedClass } from './style.css';

interface IProps {
  data: IMenuConfigItem;
  isOpen?: boolean;
}

export const FooterColumn: FC<IProps> = ({ data, isOpen }) => {
  return (
    <Stack
      className={classNames(footerColumnClass, {
        [isClosedClass]: !isOpen,
      })}
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
