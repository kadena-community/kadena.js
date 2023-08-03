import type { INavHeaderProps, INavItems } from './NavHeader';
import { NavHeaderChildren } from './NavHeader.stories.children';
import { NavHeader, NavHeaderContent, NavHeaderNavigation } from './';

import { logoVariants } from '@components/BrandLogo';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const sampleNavItems: INavItems = [
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
  {
    title: 'Learn Pact',
    href: '#pact',
  },
  {
    title: 'Marmalade',
    href: '#marmalade',
  },
];

type StoryProps = {
  linksCount: number;
  renderContent: boolean;
  useCustomNavigation: boolean;
  customNavigation: INavItems;
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
          'Note: maximum navigation items is currently limited (not technically enforced).\n\nPending design update to support more items.',
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
    useCustomNavigation: {
      control: { type: 'boolean' },
      description: 'Add your own navigation items instead of the sample ones?',
    },
    linksCount: {
      control: { type: 'range', min: 1, max: sampleNavItems.length, step: 1 },
      description: 'Adjust sample navigation items count',
      if: { arg: 'useCustomNavigation', neq: true },
    },
    customNavigation: {
      defaultValue: [],
      description: 'Custom navigation items',
      control: {
        type: 'array',
      },
      if: { arg: 'useCustomNavigation', eq: true },
    },
    renderContent: {
      control: { type: 'boolean' },
      description: 'Populate (right-hand side) children with sample content?',
    },
  },
};

type Story = StoryObj<StoryProps>;

export const Dynamic: Story = {
  name: 'NavHeader',
  args: {
    brand: logoVariants[0],
    linksCount: 3,
    customNavigation: sampleNavItems,
  },
  render: ({
    brand,
    useCustomNavigation,
    customNavigation,
    linksCount,
    renderContent = false,
  }) => {
    const navItems = useCustomNavigation ? customNavigation : sampleNavItems;
    console.log(navItems);
    return (
      <NavHeader brand={brand}>
        <NavHeaderNavigation>
          {navItems.slice(0, linksCount).map((item, index) => {
            return (
              <a href={item.href} target={item.target} key={index}>
                {item.title}
              </a>
            );
          })}
        </NavHeaderNavigation>
        {renderContent && (
          <NavHeaderContent>
            <NavHeaderChildren />
          </NavHeaderContent>
        )}
      </NavHeader>
    );
  },
};

export default meta;
