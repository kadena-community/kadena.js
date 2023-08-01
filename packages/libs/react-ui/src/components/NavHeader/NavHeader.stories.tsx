import type { INavHeaderProps, INavItems } from './NavHeader';
import { NavHeader } from './';

import { logoVariants } from '@components/Logo';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const navItems: INavItems = [
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

type StoryProps = { linksCount: number } & INavHeaderProps;

const meta: Meta<StoryProps> = {
  title: 'Navigation/NavHeader',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
    },
    docs: {
      description: {
        component:
          'Note: maximum navigation items is currently limited.\n\nPending design update to support more items.',
      },
    },
  },
  argTypes: {
    brand: {
      control: {
        type: 'select',
      },
      description: 'Logo variant',
      options: logoVariants,
      table: {
        defaultValue: { summary: logoVariants[0] },
      },
    },
    linksCount: {
      control: { type: 'range', min: 1, max: navItems.length, step: 1 },
      description: 'Sample navigation items',
    },
  },
};

type Story = StoryObj<StoryProps>;

export const Dynamic: Story = {
  name: 'NavHeader',
  args: { brand: logoVariants[0], linksCount: navItems.length },
  render: ({ brand, linksCount }) => {
    return <NavHeader brand={brand} items={navItems.slice(0, linksCount)} />;
  },
};

export default meta;
