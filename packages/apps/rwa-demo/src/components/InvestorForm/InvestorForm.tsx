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
import { cloneElement, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AccountNameField } from '../Fields/AccountNameField';

interface IProps {
  investor?: IRecord;
  onClose?: () => void;
  trigger: ReactElement;
}

export const InvestorForm: FC<IProps> = ({ onClose, trigger, investor }) => {
  const { submit, isAllowed } = useAddInvestor({
    investorAccount: investor?.accountName,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Omit<IRegisterIdentityProps, 'agent'>>({
    mode: 'onChange',
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
    setIsRightAsideExpanded(false);
    setIsOpen(false);
    if (onClose) onClose();
  };

  const onSubmit = async (data: Omit<IRegisterIdentityProps, 'agent'>) => {
    await submit(data);
    handleOnClose();
  };

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader
              label={investor?.accountName ? 'Edit Investor' : 'Add Investor'}
            />
            <RightAsideContent>
              <AccountNameField
                error={errors.accountName}
                accountName={investor?.accountName}
                control={control}
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
              <Button isDisabled={!isAllowed} type="submit">
                {investor?.accountName ? 'Edit Investor' : 'Add Investor'}
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
