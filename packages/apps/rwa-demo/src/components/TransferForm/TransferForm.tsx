import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useForcedTransferTokens } from '@/hooks/forcedTransferTokens';
import { useGetFrozenTokens } from '@/hooks/getFrozenTokens';
import { useGetInvestorBalance } from '@/hooks/getInvestorBalance';
import { useGetInvestors } from '@/hooks/getInvestors';
import { useTransferTokens } from '@/hooks/transferTokens';
import type { IForcedTransferTokensProps } from '@/services/forcedTransferTokens';
import { isFrozen } from '@/services/isFrozen';
import type { ITransferTokensProps } from '@/services/transferTokens';
import {
  Button,
  maskValue,
  Notification,
  NotificationHeading,
  Select,
  SelectItem,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AssetPausedMessage } from '../AssetPausedMessage/AssetPausedMessage';
import { DiscoveredAccount } from '../DiscoveredAccount/DiscoveredAccount';

interface IProps {
  onClose?: () => void;
  trigger: ReactElement;
  isForced?: boolean;
  investorAccount: string;
}

export const TransferForm: FC<IProps> = ({
  onClose,
  trigger,
  isForced = false,
  investorAccount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { asset } = useAsset();
  const [investorToAccount, setInvestorToAccount] = useState<string>('');
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
  const { account } = useAccount();
  const { data: balance } = useGetInvestorBalance({ investorAccount });
  const { data: investors } = useGetInvestors();
  const { submit: forcedSubmit, isAllowed: isForcedAllowed } =
    useForcedTransferTokens();
  const { submit, isAllowed } = useTransferTokens();
  const { data: frozenAmount } = useGetFrozenTokens({
    investorAccount,
  });
  const [selectedAccountIsFrozen, setSelectedAccountIsFrozen] = useState<
    boolean | undefined
  >(undefined);

  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<ITransferTokensProps | IForcedTransferTokensProps>({
    values: {
      amount: 0,
      investorFromAccount: investorAccount,
      investorToAccount: '',
      isForced,
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

  const onSubmit = async (
    data: IForcedTransferTokensProps | ITransferTokensProps,
  ) => {
    if (data.isForced) {
      await forcedSubmit(data);
    } else {
      await submit(data);
    }
    handleOnClose();
  };

  const filteredInvestors = investors.filter(
    (i) => i.accountName !== investorAccount,
  );

  const handleAccountChange = (cb: any) => async (value: any) => {
    setSelectedAccountIsFrozen(undefined);
    setInvestorToAccount(value);
    if (!account || !asset) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const res = await isFrozen({ investorAccount: value, account }, asset);
    setSelectedAccountIsFrozen(res as boolean | undefined);

    return cb(value);
  };

  if (!account) return;
  const maxAmount = isForced ? balance : balance - frozenAmount;

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Transfer Tokens" />
            <RightAsideContent>
              {isForced && (
                <Stack width="100%" marginBlockEnd="md">
                  <Notification role="status" intent="warning">
                    <NotificationHeading>Warning</NotificationHeading>
                    This is a forced transfer (partial frozen tokens can also be
                    transfered)
                  </Notification>
                </Stack>
              )}
              <Stack flexDirection="column" gap="md">
                <input type="hidden" {...register('isForced', {})} />
                <TextField
                  label="Amount"
                  type="number"
                  {...register('amount', {
                    required: {
                      value: true,
                      message: 'This field is required',
                    },
                    min: {
                      value: 1,
                      message: 'The value should be at least 1',
                    },
                    max: {
                      value: maxAmount,
                      message:
                        'The value can not be more than your balance ( - frozen tokens)',
                    },
                  })}
                  variant={errors.amount?.message ? 'negative' : 'default'}
                  description={`max amount tokens: ${maxAmount}`}
                  errorMessage={errors.amount?.message}
                />

                <Controller
                  name="investorToAccount"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      label="Select an investor"
                      items={filteredInvestors}
                      selectedKey={field.value}
                      variant={
                        errors.investorToAccount?.message
                          ? 'negative'
                          : 'default'
                      }
                      onSelectionChange={handleAccountChange(field.onChange)}
                      errorMessage={errors.investorToAccount?.message}
                    >
                      {(item) => (
                        <SelectItem key={item.accountName}>
                          {maskValue(item.accountName)}
                        </SelectItem>
                      )}
                    </Select>
                  )}
                />
              </Stack>
              <DiscoveredAccount
                accountAddress={investorToAccount}
                asset={asset}
              />
              {selectedAccountIsFrozen && (
                <Notification role="status">
                  The selected account is frozen and is not allowed to receive
                  tokens
                </Notification>
              )}
            </RightAsideContent>

            <RightAsideFooter message={<AssetPausedMessage />}>
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <Button
                isDisabled={
                  (isForced ? !isForcedAllowed : !isAllowed) ||
                  !isValid ||
                  selectedAccountIsFrozen === true
                }
                type="submit"
              >
                Transfer
              </Button>
            </RightAsideFooter>
          </form>
        </RightAside>
      )}
      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
