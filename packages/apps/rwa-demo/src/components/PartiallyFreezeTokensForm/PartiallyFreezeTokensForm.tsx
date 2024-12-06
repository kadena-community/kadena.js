import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useFreeze } from '@/hooks/freeze';
import { useTogglePartiallyFreezeTokens } from '@/hooks/togglePartiallyFreezeTokens';
import { getBalance } from '@/services/getBalance';
import { getFrozenTokens } from '@/services/getFrozenTokens';
import type { ITogglePartiallyFreezeTokensProps } from '@/services/togglePartiallyFreezeTokens';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import type { FC, ReactElement } from 'react';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AssetPausedMessage } from '../AssetPausedMessage/AssetPausedMessage';
import { InvestorFrozenMessage } from '../InvestorFrozenMessage/InvestorFrozenMessage';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
import type { ITransaction } from '../TransactionsProvider/TransactionsProvider';

interface IProps {
  onClose?: () => void;
  investorAccount: string;
  trigger: ReactElement;
}

export const PartiallyFreezeTokensForm: FC<IProps> = ({
  onClose,
  investorAccount,
  trigger,
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const { account } = useAccount();
  const [tx, setTx] = useState<ITransaction>();
  const resolveRef = useRef<Function | null>(null);
  const { paused } = useAsset();
  const [isOpen, setIsOpen] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [frozenData, setFrozenData] = useState(0);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();

  const { submit } = useTogglePartiallyFreezeTokens();
  const {
    handleSubmit,
    formState: { isValid, errors },
    control,
  } = useForm<ITogglePartiallyFreezeTokensProps>({
    values: {
      amount: '0',
      investorAccount,
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

  const onSubmit = async (data: ITogglePartiallyFreezeTokensProps) => {
    const freeze = parseInt(data.amount) >= 0;

    const transaction = await submit({
      ...data,
      amount: `${Math.abs(parseInt(data.amount))}`,
      freeze,
    });
    setTx(transaction);

    return transaction;
  };

  useEffect(() => {
    if (tx && resolveRef.current) {
      resolveRef.current(tx);
      handleOnClose();
    }
  }, [tx]);

  const waitForStateChange = () => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handlePress = async () => {
    const message = await waitForStateChange();
    return message;
  };

  const init = async () => {
    const res = await getBalance({ investorAccount, account: account! });

    if (typeof res === 'number') {
      setTokenBalance(res);
    }

    const frozenRes = await getFrozenTokens({
      investorAccount,
      account: account!,
    });

    if (typeof frozenRes === 'number') {
      setFrozenData(frozenRes);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  return (
    <>
      {isRightAsideExpanded && isOpen && (
        <RightAside isOpen onClose={handleOnClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <RightAsideHeader label="Partially Freeze Tokens" />
            <RightAsideContent>
              <Controller
                name="amount"
                control={control}
                rules={{ required: true, max: tokenBalance - frozenData }}
                render={({ field }) => (
                  <TextField
                    label="Amount"
                    {...field}
                    errorMessage={errors.amount?.message}
                    description={`max amount: ${tokenBalance - frozenData}`}
                  />
                )}
              />
            </RightAsideContent>
            <RightAsideFooter
              message={
                <>
                  <InvestorFrozenMessage investorAccount={investorAccount} />
                  <AssetPausedMessage />
                </>
              }
            >
              <Button onPress={handleOnClose} variant="transparent">
                Cancel
              </Button>
              <SendTransactionAnimation
                onPress={handlePress}
                trigger={
                  <Button
                    isDisabled={frozen || paused || !isValid}
                    type="submit"
                  >
                    Freeze / UnFreeze
                  </Button>
                }
              />
            </RightAsideFooter>
          </form>
        </RightAside>
      )}

      {cloneElement(trigger, { ...trigger.props, onPress: handleOpen })}
    </>
  );
};
