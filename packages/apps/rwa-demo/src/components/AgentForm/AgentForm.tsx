import { useAsset } from '@/hooks/asset';
import { useEditAgent } from '@/hooks/editAgent';
import { useGetAgentRoles } from '@/hooks/getAgentRoles';
import type { IAddAgentProps } from '@/services/addAgent';
import { AGENTROLES } from '@/services/addAgent';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { Button, CheckboxGroup, Stack } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { Attributes, FC, ReactElement } from 'react';
import { cloneElement, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AccountNameField } from '../Fields/AccountNameField';

interface IProps {
  agent?: IRecord;
  onClose?: () => void;
  trigger: ReactElement<
    Partial<HTMLButtonElement> &
      Attributes & {
        onPress?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
      }
  >;
}

export const AgentForm: FC<IProps> = ({ onClose, agent, trigger }) => {
  const { asset, agents } = useAsset();
  const { getAll: getAllAgentRoles, setAssetRolesForAccount } =
    useGetAgentRoles();
  const { submit, isAllowed } = useEditAgent();
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();

  useEffect(() => {
    if (!agent || !asset) return;

    setAssetRolesForAccount(agent.accountName, asset);
  }, [agent, asset]);

  const {
    handleSubmit,
    control,
    register,
    watch,
    setError,
    formState: { isValid, errors },
    reset,
  } = useForm<IAddAgentProps>({
    mode: 'onChange',
    defaultValues: {
      accountName: agent?.accountName ?? '',
      alreadyExists: !!agent?.accountName,
      roles: getAllAgentRoles(),
    },
  });

  useEffect(() => {
    reset({
      accountName: agent?.accountName,
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
              <Stack flexDirection="column" width="100%" gap="md">
                <AccountNameField
                  exemptAccounts={agents.map((a) => a.accountName)}
                  error={errors.accountName}
                  accountName={agent?.accountName}
                  control={control}
                  value={watch('accountName')}
                  setError={setError}
                />

                <CheckboxGroup direction="column" label="Roles" name="roles">
                  {Object.entries(AGENTROLES)
                    .filter((role) => role[1] !== AGENTROLES.OWNER)
                    .map(([key, val]) => {
                      return (
                        <Stack
                          key={key}
                          width="100%"
                          gap="sm"
                          alignItems="center"
                        >
                          <input
                            type="checkbox"
                            id={val}
                            value={val}
                            {...register('roles')}
                          />
                          <label htmlFor={val}>{val}</label>
                        </Stack>
                      );
                    })}
                </CheckboxGroup>
              </Stack>
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
