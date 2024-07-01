import { menuConfig } from '@/utils/menuConfig';
import { SpireKeyKdacolorLogoWhite } from '@kadena/react-icons/product';
import { Button, Heading, Stack, TextLink } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';
import { GraphQLQueryDialog } from '../graphql-query-dialog/graphql-query-dialog';
import { buttonSizeClass } from '../navbar/styles.css';
import { listClass, menuClass, menuOpenClass } from './styles.css';

interface IProps {
  isOpen: boolean;
}

const Sidemenu: FC<PropsWithChildren<IProps>> = ({ isOpen }) => {
  return (
    <Stack
      as="section"
      flexDirection="column"
      width="100%"
      className={classNames(menuClass, isOpen && menuOpenClass)}
    >
      <Stack paddingBlock="xxxl" />
      <Stack width="100%" justifyContent="flex-end" paddingInlineEnd="sm">
        <GraphQLQueryDialog />

        <Button
          className={buttonSizeClass}
          variant="primary"
          startVisual={<SpireKeyKdacolorLogoWhite />}
        />
      </Stack>

      <ul className={listClass}>
        {menuConfig.map((menuItem) => (
          <li key={menuItem.label}>
            <Heading as="h5">{menuItem.label}</Heading>
            <ul>
              {menuItem.children.map((item) => (
                <li key={item.url}>
                  <TextLink href={item.url}>{item.label}</TextLink>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Stack>
  );
};

export default Sidemenu;
