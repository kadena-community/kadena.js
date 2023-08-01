import type { INavHeaderContainerProps } from './NavHeader';
import { navClass } from './NavHeader.css';
import { Target } from './NavHeaderLink';
import { INavHeaderLogoProps } from './NavHeaderLogo';
import { NavHeader } from './';

import type { LogoVariant } from '@components/Logo';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type StoryProps = { linksCount: number } & INavHeaderContainerProps &
  INavHeaderLogoProps;

const links: { title: string; href: string; target?: Target }[] = [
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
  title: 'NavHeader',
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      sort: 'requiredFirst',
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
      control: { type: 'range', min: 1, max: links.length, step: 1 },
    },
  },
};

type Story = StoryObj<StoryProps>;

export const Dynamic: Story = {
  name: 'NavHeader',
  args: { brand: 'default', linksCount: links.length },
  render: ({ brand, linksCount }) => {
    const navItems = links.slice(0, linksCount);
    return (
      <NavHeader.Root>
        <NavHeader.Logo brand={brand} />
        <nav className={navClass}>
          {navItems.map((item, index) => {
            return (
              <NavHeader.Link key={index} title={item.title} href={item.href} />
            );
            // return (
            //   <Footer.LinkItem key={index} variant={variant}>
            //     {item.href !== undefined ? (
            //       <a href={item.href} target={item.target}>
            //         {item.title}
            //       </a>
            //     ) : (
            //       <span>{item.title}</span>
            //     )}
            //   </Footer.LinkItem>
            // );
          })}
        </nav>
        {/* <NavHeader.NavItem href="/">Home</NavHeader.NavItem>
          <NavHeader.NavItem href="/about">About</NavHeader.NavItem>
          <NavHeader.NavItem href="/contact">Contact</NavHeader.NavItem> */}
        {/* </NavHeader.Nav>
        <NavHeader.Content>Hello World</NavHeader.Content> */}
      </NavHeader.Root>
    );
  },
};

export default meta;
