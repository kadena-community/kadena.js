import { useAddInvestor } from '@/hooks/addInvestor';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
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
  investor?: IRecord;
  onClose?: () => void;
  trigger: ReactElement;
}

export const InvestorForm: FC<IProps> = ({ onClose, trigger, investor }) => {
  const { submit } = useAddInvestor();
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { handleSubmit, control } = useForm<
    Omit<IRegisterIdentityProps, 'agent'>
  >({
    values: {
      accountName: investor?.accountName ?? '',
      alias: investor?.alias ?? '',
      alreadyExists: !!investor?.accountName,
    },
  });

  const handleOpen = () => {
    setIsRightAsideExpanded(true);
    setIsOpen(true);
    if (trigger.props.onPress) trigger.props.onPress();
  };

  const handleOnClose = () => {
    console.log(333331);
    setIsOpen(false);
    if (onClose) onClose();
    // setIsRightAsideExpanded(false);
    // setRightAsideOnClose(() => {
    // });
  };

  const onSubmit = async (data: Omit<IRegisterIdentityProps, 'agent'>) => {
    await submit(data);
    handleOnClose();
  };

  useEffect(() => {
    console.log(isOpen);
  }, [isOpen]);

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Add Investor" />
            <RightAsideContent>
              <Controller
                name="accountName"
                control={control}
                render={({ field }) => (
                  <TextField
                    isDisabled={!!investor?.accountName}
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
              <Button type="submit">Add Investor</Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
