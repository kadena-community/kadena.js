import { useEditAgent } from '@/hooks/editAgent';
import { useGetAgentRoles } from '@/hooks/getAgentRoles';
import type { IAddAgentProps } from '@/services/addAgent';
import { AGENTROLES } from '@/services/addAgent';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { Button, CheckboxGroup, TextField } from '@kadena/kode-ui';
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
import { AccountNameField } from '../Fields/AccountNameField';

interface IProps {
  agent?: IRecord;
  onClose?: () => void;
  trigger: ReactElement;
}

export const AgentForm: FC<IProps> = ({ onClose, agent, trigger }) => {
  const { getAll: getAllAgentRoles } = useGetAgentRoles({
    agent: agent?.accountName,
  });
  const { submit, isAllowed } = useEditAgent();
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

  const {
    handleSubmit,
    control,
    register,
    formState: { isValid, errors },
    reset,
  } = useForm<IAddAgentProps>({
    mode: 'onChange',
    defaultValues: {
      accountName: agent?.accountName ?? '',
      alias: agent?.alias ?? '',
      alreadyExists: !!agent?.accountName,
      roles: getAllAgentRoles(),
    },
  });

  useEffect(() => {
    reset({
      accountName: agent?.accountName,
      alias: agent?.alias,
      alreadyExists: !!agent?.accountName,
      roles: getAllAgentRoles(),
    });
  }, [agent?.accountName, getAllAgentRoles()]);

  const handleOpen = () => {
    setIsRightAsideExpanded(true);
    setIsOpen(true);
    if (trigger.props.onPress) trigger.props.onPress();
  };

  const handleOnClose = () => {
    setIsRightAsideExpanded(false);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const onSubmit = async (data: IAddAgentProps) => {
    if (typeof data.roles === 'boolean') {
      return;
    }

    await submit(data);
    handleOnClose();
  };

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside
          isOpen={isRightAsideExpanded && isOpen}
          onClose={handleOnClose}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader
              label={agent?.accountName ? 'Edit Agent' : 'Add Agent'}
            />
            <RightAsideContent>
              <AccountNameField
                error={errors.accountName}
                accountName={agent?.accountName}
                control={control}
              />

              <Controller
                name="alias"
                control={control}
                render={({ field }) => (
                  <TextField id="alias" label="Alias" {...field} />
                )}
              />

              <CheckboxGroup direction="column" label="Roles" name="roles">
                {Object.entries(AGENTROLES).map(([key, val]) => {
                  return (
                    <label key={key}>
                      <input
                        type="checkbox"
                        value={val}
                        {...register('roles')}
                      />
                      {val}
                    </label>
                  );
                })}
              </CheckboxGroup>
            </RightAsideContent>
            <RightAsideFooter>
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <Button isDisabled={!isValid || !isAllowed} type="submit">
                {agent?.accountName ? 'Edit Agent' : 'Add Agent'}
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
