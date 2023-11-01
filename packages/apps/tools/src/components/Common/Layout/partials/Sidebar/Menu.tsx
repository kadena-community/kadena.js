import { useLayoutContext } from '@/context';
import {Accordion, Box, Heading, IconButton} from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { MenuLinkButton } from './MenuLinkButton';
import {gridItemMenuStyle, linksContainerStyle, linksMenuTitleClass, subMenuTitleClass} from './styles.css';
import useTranslation from "next-translate/useTranslation";

export const Menu: FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');


  const links = [
    {
      title: t('Tutorial'),
      href: 'https://kadena.io/',
      target: '_blank',
    },
    {
      title: t('Documentation'),
      href: 'https://kadena.io/',
      target: '_blank',
    },
    {
      title: t('Privacy & Policy'),
      href: 'https://kadena.io/',
      target: '_blank',
    },
    {
      title: 'Terms of use',
      href: 'https://kadena.io/',
      target: '_blank',
    },
  ];

  const { activeMenu, setActiveMenuIndex } = useLayoutContext();
  if (!activeMenu) return null;

  return (
    <div className={gridItemMenuStyle}>
      <div className={subMenuTitleClass}>
        <span>{activeMenu.title}</span>
        <IconButton
          icon={'Close'}
          onClick={() => setActiveMenuIndex(undefined)}
          title={activeMenu.title}
        />
      </div>
      <Accordion.Root>
        {activeMenu.items?.map((item, index) => (
          <MenuLinkButton
            title={item.title}
            key={`menu-link-${index}`}
            href={item.href}
            active={item.href === router.pathname}
          />
        ))}
      </Accordion.Root>
      <div className={linksContainerStyle}>
        <div className={linksMenuTitleClass}>
          <span>{'Links'}</span>
        </div>
        <ul>
          {links.map(link => (
            <li key={link.title}>
              <a
                href={link.href}
                target={link.target}
                rel="noreferrer"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
