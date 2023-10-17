import type { INavHeaderRootProps } from './NavHeader';
import type { INavHeaderLinkProps } from './NavHeaderLink';
import { NavHeader } from './';

import { logoVariants } from '@components/BrandLogo';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

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
  navHeaderActiveLink?: string;
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
    linksCount: {
      control: { type: 'range', min: 1, max: sampleNavItems.length, step: 1 },
      description: 'Adjust sample navigation items count',
    },
    navHeaderActiveLink: {
      control: { type: 'select' },
      description: 'Allows users to control the active href',
      options: Object.values(sampleNavItems).map((item) => item.children),
      table: {
        defaultValue: { summary: undefined },
      },
    },
  },
};

type IStory = StoryObj<StoryProps>;

export const Dynamic: IStory = {
  name: 'NavHeader',
  args: {
    brand: logoVariants[0],
    linksCount: 3,
    navHeaderActiveLink: undefined,
  },
  render: ({ brand, linksCount, navHeaderActiveLink }) => {
    const activeHref = navHeaderActiveLink
      ? Object.values(sampleNavItems).find(
          (item) => item.children === navHeaderActiveLink,
        )?.href
      : undefined;
    const [value, setValue] = useState<string>(sampleNetworkItems[0]);

    return (
      <NavHeader.Root brand={brand}>
        <NavHeader.Navigation activeHref={activeHref}>
          {sampleNavItems.slice(0, linksCount).map((item, index) => (
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
            value={value}
            onChange={(e) => {
              console.log('clicked on', e.target.value);
              setValue(e.target.value);
            }}
            icon="Earth"
          >
            {sampleNetworkItems.map((network) => (
              <option key={network} value={network}>
                {network}
              </option>
            ))}
          </NavHeader.Select>
        </NavHeader.Content>
      </NavHeader.Root>
    );
  },
};

export default meta;
