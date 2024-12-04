import { useAddAgent } from '@/hooks/addAgent';
import type { IAddAgentProps } from '@/services/addAgent';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface IProps {
  agent?: IRecord;
  onClose?: () => void;
  trigger: ReactElement;
}

export const AgentForm: FC<IProps> = ({ onClose, agent, trigger }) => {
  const { submit } = useAddAgent();
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { handleSubmit, control } = useForm<IAddAgentProps>({
    defaultValues: {
      accountName: agent?.accountName ?? '',
      alias: agent?.alias ?? '',
      alreadyExists: !!agent?.accountName,
    },
  });

  const handleOpen = () => {
    setIsRightAsideExpanded(true);
    setIsOpen(true);
    if (trigger.props.onPress) trigger.props.onPress();
  };

  const handleOnClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const onSubmit = async (data: IAddAgentProps) => {
    await submit(data);
    handleOnClose();
  };

  useEffect(() => {
    console.log('agent', isOpen);
  }, [isOpen]);

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside
          isOpen={isRightAsideExpanded && isOpen}
          onClose={handleOnClose}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Add Agent" />
            <RightAsideContent>
              <Controller
                name="accountName"
                control={control}
                render={({ field }) => (
                  <TextField
                    isDisabled={!!agent?.accountName}
                    label="AccountName"
                    {...field}
                  />
                )}
              />

              <Controller
                name="alias"
                control={control}
                render={({ field }) => <TextField label="Alias" {...field} />}
              />
            </RightAsideContent>
            <RightAsideFooter>
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <Button type="submit">Add Agent</Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
