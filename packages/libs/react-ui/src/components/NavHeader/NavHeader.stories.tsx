import type { Meta, StoryObj } from '@storybook/react';
import type { INavHeaderProps, INavItems } from './NavHeader';

import React from 'react';

import { logoVariants } from '@components/Logo';
import { NavHeader } from './';
import { NavHeaderChildren } from './NavHeader.stories.children';

const navItems: INavItems = [
  {
    title: 'Faucet',
    href: '#faucet',
  },
  {
    title: 'Transactions',
    href: '#transactions',
  },
  {
    title: 'Balance',
    href: '#balance',
  },
];

type StoryProps = {
  linksCount: number;
  renderChildren: boolean;
} & INavHeaderProps;

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
      options: ['-', ...logoVariants],
      table: {
        defaultValue: { summary: logoVariants[0] },
      },
    },
    linksCount: {
      control: { type: 'range', min: 1, max: navItems.length, step: 1 },
      description: 'Adjust sample navigation items count',
    },
    renderChildren: {
      control: { type: 'boolean' },
      description: 'Populate (right-hand side) children with sample content?',
    },
  },
};

type Story = StoryObj<StoryProps>;

export const Dynamic: Story = {
  name: 'NavHeader',
  args: { brand: logoVariants[0], linksCount: navItems.length },
  render: ({ brand, linksCount, renderChildren = false }) => {
    return (
      <NavHeader brand={brand} items={navItems.slice(0, linksCount)}>
        {renderChildren && <NavHeaderChildren />}
      </NavHeader>
    );
  },
};

export default meta;
