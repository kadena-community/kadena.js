import { useAsset } from '@/hooks/asset';
import { useEditAgent } from '@/hooks/editAgent';
import { useGetAgentRoles } from '@/hooks/getAgentRoles';
import type { IAddAgentProps } from '@/services/addAgent';
import { AGENTROLES } from '@/services/addAgent';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { Button, CheckboxGroup } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AccountNameField } from '../Fields/AccountNameField';
import { AliasField } from '../Fields/AliasField';

interface IProps {
  agent?: IRecord;
  onClose?: () => void;
  trigger: ReactElement;
}

export const AgentForm: FC<IProps> = ({ onClose, agent, trigger }) => {
  const { getAll: getAllAgentRoles } = useGetAgentRoles();
  const { submit, isAllowed } = useEditAgent();
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();

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

              <AliasField
                error={errors.alias}
                alias={agent?.alias}
                control={control}
              />

              <CheckboxGroup direction="column" label="Roles" name="roles">
                {Object.entries(AGENTROLES)
                  .filter((role) => role[1] !== AGENTROLES.OWNER)
                  .map(([key, val]) => {
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
