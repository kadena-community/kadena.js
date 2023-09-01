import { NavFooter, useModal } from '@kadena/react-ui';

import { OptionsModal } from '@/components/Global/OptionsModal';
import { useTheme } from 'next-themes';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

const FooterWrapper: FC = () => {
  const { systemTheme, theme, setTheme } = useTheme();
  const { renderModal } = useModal();

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const { t } = useTranslation('common');
  const openModal = (): void => renderModal(<OptionsModal />, 'Settings');

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
    <NavFooter.Root darkMode>
      <NavFooter.Panel>
        {links.map((item, index) => {
          return (
            <NavFooter.Link key={index} href={item.href} target={item.target}>
              {item.title}
            </NavFooter.Link>
          );
        })}
      </NavFooter.Panel>
      <NavFooter.Panel>
        <NavFooter.IconButton
          icon={'ApplicationBrackets'}
          onClick={() => openModal()}
        />
        <NavFooter.IconButton
          icon={'ThemeLightDark'}
          onClick={() => toggleTheme()}
        />
        <NavFooter.IconButton icon={'ApplicationBrackets'} text="English" />
      </NavFooter.Panel>
    </NavFooter.Root>
  );
};

export default FooterWrapper;
