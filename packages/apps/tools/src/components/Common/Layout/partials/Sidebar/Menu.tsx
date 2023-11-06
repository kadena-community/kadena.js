import { useLayoutContext } from '@/context';
import { Accordion, IconButton } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
import { MenuLinkButton } from './MenuLinkButton';
import {
  gridItemMenuStyle,
  subMenuContentStyle,
  subMenuTitleClass,
} from './styles.css';

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
      title: t('Terms of use'),
      href: 'https://kadena.io/',
      target: '_blank',
    },
  ];

  const {
    activeMenu,
    isMenuOpen,
    setActiveMenuIndex,
    visibleLinks,
    setVisibleLinks,
  } = useLayoutContext();

  const handleCloseMenu = () => {
    setActiveMenuIndex(undefined);
    setVisibleLinks(false);
  };

  if (!isMenuOpen) return null;

  return (
    <div className={gridItemMenuStyle}>
      {visibleLinks ? (
        <>
          <div className={subMenuTitleClass}>
            <span>{t('Resource links')}</span>
            <IconButton
              icon={'Close'}
              onClick={() => handleCloseMenu()}
              title={t('Resource links')}
            />
          </div>
          <div className={subMenuContentStyle}>
            <Accordion.Root>
              {links.map((item, index) => (
                <MenuLinkButton
                  title={item.title}
                  key={`menu-link-${index}`}
                  href={item.href}
                  active={item.href === router.pathname}
                />
              ))}
            </Accordion.Root>
          </div>
        </>
      ) : (
        <>
          <div className={subMenuTitleClass}>
            <span>{activeMenu?.title}</span>
            <IconButton
              icon={'Close'}
              onClick={() => handleCloseMenu()}
              title={activeMenu?.title}
            />
          </div>
          <div className={subMenuContentStyle}>
            <Accordion.Root>
              {activeMenu?.items?.map((item, index) => (
                <MenuLinkButton
                  title={item.title}
                  key={`menu-link-${index}`}
                  href={item.href}
                  active={item.href === router.pathname}
                />
              ))}
            </Accordion.Root>
          </div>
        </>
      )}
    </div>
  );
};
