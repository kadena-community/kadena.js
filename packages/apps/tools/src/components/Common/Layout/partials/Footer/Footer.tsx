import { NavFooter, SystemIcon, useModal } from '@kadena/react-ui';

import { linkClass } from './styles.css';

import { OptionsModal } from '@/components/Global/OptionsModal';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

const FooterWrapper: FC = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const { renderModal } = useModal();

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const { t } = useTranslation('common');
  const openModal = (): void => renderModal(<OptionsModal />);

  const toggleTheme = (): void => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

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

  return (
    <NavFooter.Root variant="dark">
      <NavFooter.Panel>
        {links.map((item, index) => {
          return (
            <NavFooter.Link key={index} variant="dark">
              {item.href !== undefined ? (
                <Link
                  className={linkClass}
                  href={item.href}
                  target={item.target}
                  passHref
                >
                  {item.title}
                </Link>
              ) : (
                <span>{item.title}</span>
              )}
            </NavFooter.Link>
          );
        })}
      </NavFooter.Panel>
      <NavFooter.Panel>
        <NavFooter.IconButton
          variant="dark"
          icon={SystemIcon.ApplicationBrackets}
          onClick={() => openModal()}
        />
        <NavFooter.IconButton
          variant="dark"
          icon={SystemIcon.ThemeLightDark}
          onClick={() => toggleTheme()}
        />
        <NavFooter.IconButton
          variant="dark"
          icon={SystemIcon.ApplicationBrackets}
          text="English"
        />
      </NavFooter.Panel>
    </NavFooter.Root>
  );
};

export default FooterWrapper;
