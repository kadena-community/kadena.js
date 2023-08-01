import type { INavHeaderProps, INavItemTarget } from './NavHeader';
import { NavHeader } from './';

import type { LogoVariant } from '@components/Logo';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type StoryProps = { linksCount: number } & INavHeaderProps;

const items: { title: string; href: string; target?: INavItemTarget }[] = [
  {
    title: 'Faucet',
    href: '/faucet',
  },
  {
    title: 'Transactions',
    href: '/transactions',
  },
  {
    title: 'Balance',
    href: '/balance',
  },
];

const meta: Meta<StoryProps> = {
  title: 'Navigation/NavHeader',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component: 'Note: maximum navigation items is currently limited.\n\nPending design update to support more items.'
      },
    },
  },
  argTypes: {
    brand: {
      options: ['default', 'DevTools', 'Docs'] as LogoVariant[],
      control: {
        type: 'select',
      },
    },
    linksCount: {
      control: { type: 'range', min: 1, max: items.length, step: 1 },
    },
  },
};

type Story = StoryObj<StoryProps>;

export const Dynamic: Story = {
  name: 'NavHeader',
  args: { brand: 'default', linksCount: items.length },
  render: ({ brand, linksCount } ) => {
    const navItems = items.slice(0, linksCount);
    return (
      <NavHeader brand={brand} items={navItems} />
    );
  },
};

export default meta;
