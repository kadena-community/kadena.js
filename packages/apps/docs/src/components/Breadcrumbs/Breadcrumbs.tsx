import { Box, Breadcrumbs as StyledBreadcrumbs } from '@kadena/react-ui';

import { type IMenuItem, type ProductIconNames } from '@/types/Layout';
import Link from 'next/link';
import React, { type FC, useMemo } from 'react';

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

  return (
    <Box data-cy="breadcrumbs" marginTop="$10" marginBottom="$4">
      <StyledBreadcrumbs.Root icon={items[0]?.icon}>
        {items.map((item, idx) =>
          idx < items.length - 1 ? (
            <StyledBreadcrumbs.Item key={item.root} asChild>
              <Link href={`#${item.root}`}>{item.title}</Link>
            </StyledBreadcrumbs.Item>
          ) : (
            <StyledBreadcrumbs.Item key={item.root}>
              {item.title}
            </StyledBreadcrumbs.Item>
          ),
        )}
      </StyledBreadcrumbs.Root>
    </Box>
  );
};
