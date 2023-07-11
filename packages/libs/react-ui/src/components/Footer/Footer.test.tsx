import { Footer } from '@components/Footer';
import { SystemIcon } from './../../';

import { render } from '@testing-library/react';
import React from 'react';
import { footerPanel } from '@components/Footer/Footer.css';

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
        title: 'Language',
        text: 'English',
      },
      {
        icon: SystemIcon.Account,
        title: 'Account',
      },
    ];

    const color = 'default';

    const { getByTestId, getAllByTestId } = render(
      <Footer.Root variant="web">
        <Footer.Panel variant="web">
          {menuLinks.map((item, index) => {
            return (
              <Footer.LinkItem
                key={index}
                title={item.title}
                href={item.href}
                color={color}
              />
            );
          })}
        </Footer.Panel>
        <Footer.Panel variant="web">
          {icons.map((item, index) => {
            return (
              <Footer.IconItem
                key={index}
                title={item.title}
                color={color}
                icon={item.icon}
              />
            );
          })}
        </Footer.Panel>
      </Footer.Root>,
    );

    const footerContainer = getByTestId('kda-footer');
    const footerPanels = getAllByTestId('kda-footer-panel');
    const menuLinksItems = getAllByTestId('kda-footer-link-item');
    const iconItems = getAllByTestId('kda-footer-icon-item');
    expect(footerContainer).toBeInTheDocument();
    expect(footerPanels).toHaveLength(2);
    expect(menuLinksItems).toHaveLength(2);
    expect(iconItems).toHaveLength(2);
  });
});
