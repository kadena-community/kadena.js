import { Box, Breadcrumbs as StyledBreadcrumbs } from '@kadena/react-ui';

import type { IMenuItem } from '@/types/Layout';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useMemo } from 'react';

interface IProps {
  menuItems: IMenuItem[];
}

interface IBreadcrumbItem {
  root: string;
  title: string;
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
      });

      return checkSubTree(i.children);
    };

    checkSubTree(menuItems);

    return tree;
  }, [menuItems]);

  return (
    <Box data-cy="breadcrumbs" marginTop="$10" marginBottom="$4">
      <StyledBreadcrumbs.Root>
        {items.map((item, idx) =>
          idx < items.length - 1 ? (
            <StyledBreadcrumbs.Item key={item.root} asChild>
              <Link href={`${item.root}`}>{item.title}</Link>
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
