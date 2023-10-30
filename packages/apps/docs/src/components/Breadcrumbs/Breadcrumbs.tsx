import type { IMenuItem } from '@/Layout';
import { Box, Breadcrumbs as StyledBreadcrumbs } from '@kadena/react-ui';
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
    let lastItem: IMenuItem | undefined;

    const checkSubTree = (subTree: IMenuItem[]): void => {
      const item = subTree.find((i) => i.isMenuOpen);

      if (!item) return;
      lastItem = item;
      const menuStr = item.children.length > 0 ? item.menu : item.label;
      tree.push({
        root: item.root,
        title: menuStr,
      });

      return checkSubTree(item.children);
    };

    checkSubTree(menuItems);

    if (
      lastItem &&
      lastItem.isIndex &&
      tree[tree.length - 1].title.toLowerCase() !== lastItem.label.toLowerCase()
    ) {
      tree.push({
        root: lastItem.root,
        title: lastItem.label,
      });
    }

    return tree;
  }, [menuItems]);

  return (
    <Box data-cy="breadcrumbs" marginTop="$10" marginBottom="$4">
      <StyledBreadcrumbs.Root>
        {items.map((item, idx) =>
          idx < items.length - 1 ? (
            <StyledBreadcrumbs.Item key={`${item.root}${idx}`} asChild>
              <Link href={`${item.root}`}>{item.title}</Link>
            </StyledBreadcrumbs.Item>
          ) : (
            <StyledBreadcrumbs.Item key={`${item.root}${idx}`}>
              {item.title}
            </StyledBreadcrumbs.Item>
          ),
        )}
      </StyledBreadcrumbs.Root>
    </Box>
  );
};
