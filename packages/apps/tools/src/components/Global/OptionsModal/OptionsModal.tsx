import {
  Button,
  Card,
  IconButton,
  Modal,
  Stack,
  SystemIcon,
  Tag,
  Text,
  useModal,
} from '@kadena/react-ui';

import {
  largeIconStyle,
  modalButtonStyle,
  modalOptionsContentStyle,
  radioItemWrapperStyle,
  titleTagStyle,
} from '@/components/Global/OptionsModal/styles.css';
import { DevOption } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import useTranslation from 'next-translate/useTranslation';
import React, { FC, useState } from 'react';

export interface IDevOption {
  title: string;
  text: string;
  icon: React.FC;
  tag?: string;
}

export const OptionsModal: FC = () => {
  const { t } = useTranslation('common');
  const { devOption, setDevOption } = useAppContext();
  const [selected, setSelected] = useState(devOption);

  const { clearModal } = useModal();

  const devOptions: {
    [Key in DevOption]: IDevOption;
  } = {
    BASIC: {
      title: t('Basic User Interface'),
      text: t(
        'This view can be used for basic operations and handling things within the user interface.',
      ),
      icon: SystemIcon.Application,
    },
    BACKEND: {
      title: t('Backend Developers'),
      tag: t('for PACT developers'),
      text: t(
        'This option is meant for developers who need more sophisticated options within the user interface.',
      ),
      icon: SystemIcon.ApplicationBrackets,
    },
    DAPP: {
      title: t('dApp Developers'),
      tag: t('for Javascript developers'),
      text: t(
        'This option is meant for developers who need more sophisticated options within the user interface.',
      ),
      icon: SystemIcon.ApplicationBrackets,
    },
  };

  const options = Object.entries(devOptions);

  const renderOptions = (): React.JSX.Element => {
    return (
      <>
        {options.map((item) => {
          const [key, value] = item;

          return (
            <div
              key={value.title}
              className={radioItemWrapperStyle}
              onClick={() => setSelected(key as DevOption)}
            >
              <Card fullWidth>
                <Stack>
                  {selected === key ? (
                    <IconButton
                      title="Radio"
                      icon={SystemIcon.RadioboxMarked}
                      color="default"
                    />
                  ) : (
                    <IconButton
                      title="Radio"
                      icon={SystemIcon.RadioboxBlank}
                      color="default"
                    />
                  )}
                  <IconButton
                    title="Radio"
                    icon={value.icon}
                    color="default"
                    className={largeIconStyle}
                  />
                  <Stack direction="column" marginX="$md">
                    <div className={titleTagStyle}>
                      <Text as="span">{value.title}</Text>
                      {value.tag !== undefined ? <Tag>{value.tag}</Tag> : null}
                    </div>
                    <Text as="p" size="sm">
                      {value.text}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            </div>
          );
        })}
      </>
    );
  };

  const handleSave = (): void => {
    setDevOption(selected);
    clearModal();
  };

  return (
    <Modal title="Settings">
      <div className={modalOptionsContentStyle}>
        {renderOptions()}

        <div className={modalButtonStyle}>
          <Button
            title={`${t('Save')}`}
            onClick={() => handleSave()}
            color="primary"
          >
            {`${t('Save')}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
