import { SystemIcon } from '@components/Icon';
import { NavFooter } from '@components/NavFooter';
import { render } from '@testing-library/react';
import type { FC } from 'react';
import React from 'react';

const menuLinks: { label: string; href?: string }[] = [
  {
    label: 'Tutorial',
    href: 'https://kadena.io/',
  },
  {
    label: 'Documentation',
    href: 'https://kadena.io/',
  },
];

const icons: { icon: FC; text?: string }[] = [
  {
    icon: SystemIcon.Earth,
    text: 'English',
  },
  {
    icon: SystemIcon.Account,
  },
];

describe('NavFooter', () => {
  test('renders correctly', () => {
    const { getByTestId } = render(
      <NavFooter.Root>
        <NavFooter.Panel>
          {menuLinks.map((item, index) => {
            return (
              <NavFooter.Link key={index} href={item.href}>
                {item.label}
              </NavFooter.Link>
            );
          })}
        </NavFooter.Panel>
        <NavFooter.Panel>
          {icons.map((item, index) => {
            return (
              <NavFooter.IconButton
                key={index}
                icon={item.icon}
                text={item.text}
              />
            );
          })}
        </NavFooter.Panel>
      </NavFooter.Root>,
    );

    const footerContainer = getByTestId('kda-footer');
    expect(footerContainer).toBeInTheDocument();
  });

  test('shows values correctly', () => {
    const { getAllByTestId } = render(
      <NavFooter.Root>
        <NavFooter.Panel>
          {menuLinks.map((item, index) => {
            return (
              <NavFooter.Link key={index} href={item.href}>
                {item.label}
              </NavFooter.Link>
            );
          })}
        </NavFooter.Panel>
        <NavFooter.Panel>
          {icons.map((item, index) => {
            return (
              <NavFooter.IconButton
                key={index}
                icon={item.icon}
                text={item.text}
              />
            );
          })}
        </NavFooter.Panel>
      </NavFooter.Root>,
    );

    const footerPanels = getAllByTestId('kda-footer-panel');
    const menuLinksItems = getAllByTestId('kda-footer-link-item');
    const iconButtons = getAllByTestId('kda-footer-icon-item');
    expect(footerPanels).toHaveLength(2);
    expect(menuLinksItems).toHaveLength(2);
    expect(iconButtons).toHaveLength(2);
    expect(menuLinksItems[0]).toHaveTextContent('Tutorial');
    expect(iconButtons[0]).toHaveTextContent('English');
  });
});
