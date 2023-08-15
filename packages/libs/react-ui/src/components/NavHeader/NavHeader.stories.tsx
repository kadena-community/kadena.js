import type { INavHeaderRootProps, INavItems } from './NavHeader';
import { NavHeader } from './';

import { logoVariants } from '@components/BrandLogo';
import { Button } from '@components/Button';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const sampleNavItems: INavItems = [
  {
    label: 'Faucet',
    href: '#faucet',
  },
  {
    label: 'Transactions',
    href: '#transactions',
  },
  {
    label: 'Balance',
    href: '#balance',
  },
  {
    label: 'Learn Pact',
    href: '#pact',
  },
];

type StoryProps = {
  linksCount: number;
  navHeaderActiveLink: number;
  renderSampleContent: boolean;
  useCustomNavigation: boolean;
  customNavigation: INavItems;
} & INavHeaderRootProps;

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
    navHeaderActiveLink: {
      control: { disable: true },
      description:
        'Which link should be active at start? Set as NavHeader.Navigation prop to change from default',
      table: {
        defaultValue: { summary: 0 },
      },
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

type IStory = StoryObj<StoryProps>;

export const Dynamic: IStory = {
  name: 'NavHeader',
  args: {
    brand: logoVariants[0],
    linksCount: 3,
    navHeaderActiveLink: 0,
    customNavigation: sampleNavItems,
  },
  render: ({
    brand,
    useCustomNavigation,
    customNavigation,
    linksCount,
    navHeaderActiveLink,
    renderSampleContent = false,
  }) => {
    const navItems = useCustomNavigation ? customNavigation : sampleNavItems;

    return (
      <NavHeader.Root brand={brand}>
        <NavHeader.Navigation activeLink={navHeaderActiveLink}>
          {navItems.slice(0, linksCount).map((item, index) => (
            <NavHeader.Link
              key={index}
              href={item.href}
              onClick={(event) => console.log(item.label, { event })}
            >
              {item.label}
            </NavHeader.Link>
          ))}
        </NavHeader.Navigation>
        <NavHeader.Content>
          {renderSampleContent && (
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
          )}
        </NavHeader.Content>
      </NavHeader.Root>
    );
  },
};

export default meta;
