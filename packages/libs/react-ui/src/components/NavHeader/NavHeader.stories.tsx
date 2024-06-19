import {
  MonoAccountCircle,
  MonoContrast,
  MonoUsb,
} from '@kadena/react-icons/system';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { atoms } from '../../styles/atoms.css';
import { SelectItem } from '../Form/Select';
import { KadenaLogo } from '../Logo';
import {
  NavHeader,
  NavHeaderButton,
  NavHeaderLink,
  NavHeaderLinkList,
} from '../NavHeader';
import { NavHeaderSelect } from '../NavHeader/NavHeaderSelect';
import type { INavHeaderProps } from './NavHeader';
import type { INavHeaderLinkProps } from './NavHeaderLink';

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
} & INavHeaderProps;

const meta: Meta<StoryProps> = {
  title: 'Navigation/NavHeader',
  parameters: {
    status: {
      type: ['releaseCandidate'],
    },
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
    linksCount: 3,
    navHeaderActiveLink: undefined,
  },
  render: ({ linksCount, navHeaderActiveLink }) => {
    const activeHref = navHeaderActiveLink
      ? Object.values(sampleNavItems).find(
          (item) => item.children === navHeaderActiveLink,
        )?.href
      : undefined;
    const [value, setValue] = useState<string>(sampleNetworkItems[0]);

    return (
      <NavHeader
        logo={
          <a href="">
            <KadenaLogo height={40} />
          </a>
        }
        activeHref={activeHref}
      >
        <NavHeaderLinkList>
          {sampleNavItems.slice(0, linksCount).map((item, index) => (
            <NavHeaderLink
              key={index}
              href={item.href}
              onClick={(event) => console.log(item.children, { event })}
            >
              {item.children}
            </NavHeaderLink>
          ))}
        </NavHeaderLinkList>
        <NavHeaderButton endVisual={<MonoAccountCircle />} />
        <NavHeaderButton
          endVisual={<MonoContrast />}
          className={atoms({ marginInlineEnd: 'sm' })}
        />
        <NavHeaderSelect
          aria-label="Select Network"
          selectedKey={value}
          onSelectionChange={(value: any) => setValue(value)}
          startVisual={<MonoUsb />}
        >
          {sampleNetworkItems.map((network) => (
            <SelectItem key={network} textValue={network}>
              {network}
            </SelectItem>
          ))}
        </NavHeaderSelect>
      </NavHeader>
    );
  },
};

export default meta;
