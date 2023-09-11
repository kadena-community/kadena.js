import type { INavHeaderRootProps } from './NavHeader';
import type { INavHeaderLinkProps } from './NavHeaderLink';
import { NavHeader } from './';

import { logoVariants } from '@components/BrandLogo';
import { Button } from '@components/Button';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const sampleNavItems: INavHeaderLinkProps[] = [
  {
    children: 'Faucet',
    href: '#faucet',
  },
  {
    children: 'Transactions',
    href: '#transactions',
  },
  {
    children: 'Balance',
    href: '#balance',
  },
  {
    children: 'Learn Pact',
    href: '#pact',
  },
];

const sampleNetworkItems: string[] = ['Mainnet', 'Testnet'];

type StoryProps = {
  linksCount: number;
  navHeaderActiveLink: number;
  useCustomNavigation: boolean;
  customNavigation: INavHeaderLinkProps[];
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
          'The NavHeader component provides styled top bar navigation that be configured with main nav links on the left side and any additional custom items on the right side.<br><br><i>Note: In times when you need to use a different `Link` component (like next/link in Next.js), you can wrap it in the `NavHeader.Link` component and set the `asChild` prop to pass on styles and additional props.</i><br><br><i>In progress: maximum navigation items is currently limited (not technically enforced).<br>Pending design update to support more items.</i>',
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
  }) => {
    const navItems = useCustomNavigation ? customNavigation : sampleNavItems;
    const selectedNetwork = 'Mainnet';

    return (
      <NavHeader.Root brand={brand}>
        <NavHeader.Navigation activeLink={navHeaderActiveLink}>
          {navItems.slice(0, linksCount).map((item, index) => (
            <NavHeader.Link
              key={index}
              href={item.href}
              onClick={(event) => console.log(item.children, { event })}
            >
              {item.children}
            </NavHeader.Link>
          ))}
        </NavHeader.Navigation>
        <NavHeader.Content>
          <NavHeader.Select
            id="network-select"
            ariaLabel="Select Network"
            value={selectedNetwork as string}
            onChange={() => {}}
            icon="Earth"
          >
            {sampleNetworkItems.map((network) => (
              <NavHeader.SelectOption key={network} value={network}>
                {network}
              </NavHeader.SelectOption>
            ))}
          </NavHeader.Select>
        </NavHeader.Content>
      </NavHeader.Root>
    );
  },
};

export default meta;
