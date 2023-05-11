import {
  BreadcrumbItem,
  Breadcrumbs as StyledBreadcrumbs,
  ProductIcons,
} from '@kadena/react-components';

import { Box } from './styles';

import { IMenuItem } from '@/types/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useMemo } from 'react';

interface IProps {
  menuItems: IMenuItem[];
}

interface IBreadcrumbItem {
  root: string;
  title: string;
}

export const Breadcrumbs: FC<IProps> = ({ menuItems }) => {
  const { pathname } = useRouter();
  const items = useMemo(() => {
    const tree: IBreadcrumbItem[] = [];

    const checkSubTree = (subTree: IMenuItem[]): void => {
      const i = subTree?.find((item) => item.isMenuOpen);
      if (!i) return;
      tree.push({
        root: i.root,
        title: i.menu ?? i.title,
      });

      return checkSubTree(i.children);
    };

    checkSubTree(menuItems);

    return tree;
  }, [menuItems, pathname]);

  return (
    <Box>
      <StyledBreadcrumbs icon={ProductIcons.PactLanguage}>
        {items.map((item, idx) => (
          <BreadcrumbItem key={item.title}>
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
