import {
  modalButtonStyle,
  modalOptionsContentStyle,
  modalWrapperStyle,
  radioItemWrapperStyle,
  titleTagStyle,
} from '@/components/Global/OptionsModal/styles.css';
import type { DevOption } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import {
  MonoCode,
  MonoRadioButtonChecked,
  MonoRadioButtonUnchecked,
  MonoWebAsset,
} from '@kadena/react-icons/system';
import type { IDialogProps } from '@kadena/react-ui';
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  Stack,
  Tag,
  Text,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC, ReactElement } from 'react';
import React, { useEffect, useState } from 'react';

export interface IDevOption {
  title: string;
  text: string;
  icon: ReactElement;
  tag?: string;
}

interface IOptionsModalProps extends IDialogProps {}

export const OptionsModal: FC<IOptionsModalProps> = ({
  onOpenChange,
  ...rest
}) => {
  const { t } = useTranslation('common');
  const { devOption, setDevOption } = useAppContext();
  const [selected, setSelected] = useState(devOption);

  useEffect(() => {
    setSelected(devOption);
  }, [devOption]);

  const devOptions: {
    [Key in DevOption]: IDevOption;
  } = {
    BASIC: {
      title: t('devoptions-basic-title'),
      text: t(
        'This view can be used for basic operations and handling things within the user interface',
      ),
      icon: <MonoWebAsset />,
    },
    BACKEND: {
      title: t('Backend Developers'),
      tag: t('for PACT developers'),
      text: t(
        'This option is meant for developers who need more sophisticated options within the user interface',
      ),
      icon: <MonoCode />,
    },
    DAPP: {
      title: t('dApp Developers'),
      tag: t('for Javascript developers'),
      text: t(
        'This option is meant for developers who need more sophisticated options within the user interface',
      ),
      icon: <MonoCode />,
    },
  };

  const options = Object.entries(devOptions);
  const renderOptions = (): React.JSX.Element => {
    return (
      <Stack gap={'md'} flexDirection={'column'}>
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
                    <Button
                      title="Radio"
                      aria-label="Radio"
                      variant="transparent"
                      onPress={() => setSelected(key as DevOption)}
                    >
                      <MonoRadioButtonChecked />
                    </Button>
                  ) : (
                    <Button
                      title="Radio"
                      aria-label="Radio"
                      variant="transparent"
                      onPress={() => setSelected(key as DevOption)}
                    >
                      <MonoRadioButtonUnchecked />
                    </Button>
                  )}
                  <Button
                    title="Radio"
                    aria-label="Radio"
                    variant="transparent"
                    onPress={() => setSelected(key as DevOption)}
                  >
                    {value.icon}
                  </Button>
                  <Stack flexDirection="column" marginInline="md">
                    <div className={titleTagStyle}>
                      <Text as="span">{value.title}</Text>
                      {value.tag !== undefined ? <Tag>{value.tag}</Tag> : null}
                    </div>
                    <Text as="p" size="smallest">
                      {value.text}
                    </Text>
                  </Stack>
                </Stack>
              </Card>
            </div>
          );
        })}
      </Stack>
    );
  };

  return (
    <Dialog
      {...rest}
      onOpenChange={(isOpen) => {
        if (typeof onOpenChange === 'function') {
          onOpenChange(isOpen);
        }

        if (isOpen === false) {
          // When closing, reset to its original state
          setSelected(devOption);
        }
      }}
    >
      {(state) => (
        <>
          <DialogHeader>Settings</DialogHeader>
          <DialogContent>
            <div className={modalOptionsContentStyle}>
              {renderOptions()}

              <div className={modalWrapperStyle}>
                <Button
                  title={`${t('Save')}`}
                  onPress={() => {
                    setDevOption(selected);
                    state.close();
                  }}
                  className={modalButtonStyle}
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
