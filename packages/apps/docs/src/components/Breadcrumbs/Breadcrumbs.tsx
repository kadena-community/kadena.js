import {
  BreadcrumbItem,
  Breadcrumbs as StyledBreadcrumbs,
  ProductIcons,
} from '@kadena/react-components';

import { Box } from './styles';

import { IMenuItem, ProductIconNames } from '@/types/Layout';
import Link from 'next/link';
import React, { FC, useMemo } from 'react';

interface IProps {
  menuItems: IMenuItem[];
}

interface IBreadcrumbItem {
  root: string;
  title: string;
  icon?: ProductIconNames;
}

export const Breadcrumbs: FC<IProps> = ({ menuItems }) => {
  const items = useMemo(() => {
    const tree: IBreadcrumbItem[] = [];

    const checkSubTree = (subTree: IMenuItem[]): void => {
      const i = subTree.find((item) => item.isMenuOpen);

      if (!i) return;
      tree.push({
        root: i.root,
        title: i.menu,
        icon: i.icon,
      });

      return checkSubTree(i.children);
    };

    checkSubTree(menuItems);

    return tree;
  }, [menuItems]);

  let Icon;
  if (items[0]?.icon) {
    Icon = ProductIcons[items[0]?.icon];
  }

  return (
    <Box data-cy="breadcrumbs">
      <StyledBreadcrumbs icon={Icon}>
        {items.map((item, idx) => (
          <BreadcrumbItem key={item.root}>
            {idx < items.length - 1 ? (
              <Link href={item.root}>{item.title}</Link>
            ) : (
              item.title
            )}
          </BreadcrumbItem>
        ))}
      </StyledBreadcrumbs>
    </Box>
  );
};
