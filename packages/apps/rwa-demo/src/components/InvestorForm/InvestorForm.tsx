import { useAddInvestor } from '@/hooks/addInvestor';
import { useAsset } from '@/hooks/asset';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { Button } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AccountNameField } from '../Fields/AccountNameField';

interface IProps {
  investor?: IRecord;
  onClose?: () => void;
  trigger: ReactElement;
}

export const InvestorForm: FC<IProps> = ({ onClose, trigger, investor }) => {
  const { investors } = useAsset();
  const { submit, isAllowed } = useAddInvestor({
    investorAccount: investor?.accountName,
  });
  const [isOpen, setIsOpen] = useState(false);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const {
    handleSubmit,
    control,
    watch,
    setError,
    formState: { isValid, errors },
  } = useForm<Omit<IRegisterIdentityProps, 'agent'>>({
    mode: 'all',
    values: {
      accountName: investor?.accountName ?? '',
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
                exemptAccounts={investors.map((i) => i.accountName)}
                error={errors.accountName}
                accountName={investor?.accountName}
                control={control}
                value={watch('accountName')}
                setError={setError}
              />
            </RightAsideContent>
            <RightAsideFooter>
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <Button isDisabled={!isValid || !isAllowed} type="submit">
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
