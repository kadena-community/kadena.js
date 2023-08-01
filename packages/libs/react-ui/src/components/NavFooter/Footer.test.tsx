import { SystemIcon } from '@components/Icon';
import { NavFooter } from '@components/NavFooter';
import { render } from '@testing-library/react';
import React from 'react';

describe('Footer', () => {
  test('renders correctly', () => {
    const menuLinks = [
      {
        title: 'Tutorial',
        href: 'https://kadena.io/',
      },
      {
        title: 'Documentation',
        href: 'https://kadena.io/',
      },
    ];

    const icons = [
      {
        icon: SystemIcon.Earth,
        text: 'English',
      },
      {
        icon: SystemIcon.Account,
      },
    ];

    const { getByTestId } = render(
      <NavFooter.Root>
        <NavFooter.Panel>
          {menuLinks.map((item, index) => {
            return (
              <NavFooter.Link key={index} variant="dynamic">
                <a href={item.href}>{item.title}</a>
              </NavFooter.Link>
            );
          })}
        </NavFooter.Panel>
        <NavFooter.Panel>
          {icons.map((item, index) => {
            return (
              <NavFooter.IconButton
                variant="dynamic"
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
    const menuLinks = [
      {
        title: 'Tutorial',
        href: 'https://kadena.io/',
      },
      {
        title: 'Documentation',
        href: 'https://kadena.io/',
      },
    ];

    const icons = [
      {
        icon: SystemIcon.Earth,
        text: 'English',
      },
      {
        icon: SystemIcon.Account,
      },
    ];

    const { getAllByTestId } = render(
      <NavFooter.Root>
        <NavFooter.Panel>
          {menuLinks.map((item, index) => {
            return (
              <NavFooter.Link key={index} variant="dynamic">
                <a href={item.href}>{item.title}</a>
              </NavFooter.Link>
            );
          })}
        </NavFooter.Panel>
        <NavFooter.Panel>
          {icons.map((item, index) => {
            return (
              <NavFooter.IconButton
                variant="dynamic"
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
