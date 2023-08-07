import type { INavHeaderContainerProps, INavItems } from './NavHeader';
import { NavHeader } from './';

import { logoVariants } from '@components/BrandLogo';
import { Button } from '@components/Button';
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
];

type StoryProps = {
  linksCount: number;
  renderSampleContent: boolean;
  useCustomNavigation: boolean;
  customNavigation: INavItems;
} & INavHeaderContainerProps;

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
    renderSampleContent: {
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
    renderSampleContent = false,
  }) => {
    const navItems = useCustomNavigation ? customNavigation : sampleNavItems;
    return (
      <NavHeader.Root brand={brand}>
        <NavHeader.Navigation>
          {navItems.slice(0, linksCount).map((item, index) => {
            return (
              <a href={item.href} target={item.target} key={index}>
                {item.title}
              </a>
            );
          })}
        </NavHeader.Navigation>
        {renderSampleContent && (
          <NavHeader.Content>
            <Button
              as="button"
              icon="Link"
              onClick={() => {}}
              style={{ marginLeft: '1rem' }}
              title="Sample button"
              variant="positive"
            >
              Connect your wallet
            </Button>
          </NavHeader.Content>
        )}
      </NavHeader.Root>
    );
  },
};

export default meta;
