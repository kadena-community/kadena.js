import { useModal } from '@kadena/react-ui';

import { OptionsModal } from '@/components/Global/OptionsModal';
import useTranslation from 'next-translate/useTranslation';
import { useTheme } from 'next-themes';

import React, { FC } from 'react';

const Footer: FC = () => {
  const { theme, setTheme } = useTheme();
  const { renderModal } = useModal();

  const { t } = useTranslation('common');
  const openModal = (): void => renderModal(<OptionsModal />, 'title');

  const toggleTheme = (): void => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <div>
      <button
        // icon={SystemIcons.ApplicationBrackets}
        title="Options modal"
        color="primary"
        onClick={() => toggleTheme()}
      >
        Theme
      </button>
      <button
        // icon={SystemIcons.ApplicationBrackets}
        title="Options modal"
        color="primary"
        onClick={() => openModal()}
      >
        Options
      </button>
    </div>
  );
};

export default Footer;
