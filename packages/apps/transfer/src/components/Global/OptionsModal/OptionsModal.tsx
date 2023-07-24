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
  modalButton,
  modalOptionsContent,
  radioItemWrapper,
  titleTag,
  largeIcon,
} from '@/components/Global/OptionsModal/styles.css';
import { devOptions } from '@/constants/dev-options';
import { DevOption } from '@/constants/kadena';
import { useAppContext } from '@/context/app-context';
import React, { FC, useState } from 'react';

export const OptionsModal: FC = () => {
  const { devOption, setDevOption } = useAppContext();
  const [selected, setSelected] = useState(devOption);

  const { clearModal } = useModal();

  const options = Object.entries(devOptions);

  const renderOptions = () => {
    return (
      <>
        {options.map((item) => {
          const [key, value] = item;

          const Icon = value.icon;

          return (
            <div
              key={value.title}
              className={radioItemWrapper}
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
                    className={largeIcon}
                  />
                  <Stack direction="column" marginX="$md">
                    <div className={titleTag}>
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
      <div className={modalOptionsContent}>
        {renderOptions()}

        <div className={modalButton}>
          <Button.Root
            title="Save"
            onClick={() => handleSave()}
            color="primary"
          >
            Save
          </Button.Root>
        </div>
      </div>
    </Modal>
  );
};
