import {
  modalButtonStyle,
  modalOptionsContentStyle,
  radioItemWrapperStyle,
  titleTagStyle,
} from '@/components/Global/OptionsModal/styles.css';
import type { DevOption } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import type { IDialogProps, SystemIcon } from '@kadena/react-ui';
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  IconButton,
  Stack,
  Tag,
  Text,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { useState } from 'react';

export interface IDevOption {
  title: string;
  text: string;
  icon: keyof typeof SystemIcon;
  tag?: string;
}

interface IOptionsModalProps extends IDialogProps {}

export const OptionsModal: FC<IOptionsModalProps> = (props) => {
  const { t } = useTranslation('common');
  const { devOption, setDevOption } = useAppContext();
  const [selected, setSelected] = useState(devOption);

  const devOptions: {
    [Key in DevOption]: IDevOption;
  } = {
    BASIC: {
      title: t('Basic User Interface'),
      text: t(
        'This view can be used for basic operations and handling things within the user interface.',
      ),
      icon: 'Application',
    },
    BACKEND: {
      title: t('Backend Developers'),
      tag: t('for PACT developers'),
      text: t(
        'This option is meant for developers who need more sophisticated options within the user interface.',
      ),
      icon: 'ApplicationBrackets',
    },
    DAPP: {
      title: t('dApp Developers'),
      tag: t('for Javascript developers'),
      text: t(
        'This option is meant for developers who need more sophisticated options within the user interface.',
      ),
      icon: 'ApplicationBrackets',
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
                      icon={'RadioboxMarked'}
                      color="primary"
                    />
                  ) : (
                    <IconButton
                      title="Radio"
                      icon={'RadioboxBlank'}
                      color="primary"
                    />
                  )}
                  <IconButton title="Radio" icon={value.icon} color="primary" />
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

  return (
    <Dialog {...props}>
      {(state) => (
        <>
          <DialogHeader>Settings</DialogHeader>
          <DialogContent>
            <div className={modalOptionsContentStyle}>
              {renderOptions()}

              <div className={modalButtonStyle}>
                <Button
                  title={`${t('Save')}`}
                  onClick={() => {
                    setDevOption(selected);
                    state.close();
                  }}
                  color="primary"
                >
                  {`${t('Save')}`}
                </Button>
              </div>
            </div>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};
