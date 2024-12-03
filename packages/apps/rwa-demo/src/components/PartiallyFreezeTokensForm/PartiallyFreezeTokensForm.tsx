import { useAsset } from '@/hooks/asset';
import { useFreeze } from '@/hooks/freeze';
import { usePartiallyFreezeTokens } from '@/hooks/partiallyFreezeTokens';
import type { IPartiallyFreezeTokensProps } from '@/services/partiallyFreezeTokens';
import { Button, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AssetPausedMessage } from '../AssetPausedMessage/AssetPausedMessage';
import { InvestorFrozenMessage } from '../InvestorFrozenMessage/InvestorFrozenMessage';
import { SendTransactionAnimation } from '../SendTransactionAnimation/SendTransactionAnimation';
import type { ITransaction } from '../TransactionsProvider/TransactionsProvider';

interface IProps {
  onClose: () => void;
  investorAccount: string;
}

export const PartiallyFreezeTokensForm: FC<IProps> = ({
  onClose,
  investorAccount,
}) => {
  const { frozen } = useFreeze({ investorAccount });
  const [tx, setTx] = useState<ITransaction>();
  const resolveRef = useRef<Function | null>(null);
  const { paused } = useAsset();

  const { submit } = usePartiallyFreezeTokens();
  const { register, handleSubmit } = useForm<IPartiallyFreezeTokensProps>({
    values: {
      amount: 0,
      investorAccount,
    },
  });

  const onSubmit = async (data: IPartiallyFreezeTokensProps) => {
    const transaction = await submit(data);
    setTx(transaction);

    return transaction;
  };

  useEffect(() => {
    if (tx && resolveRef.current) {
      resolveRef.current(tx);
      onClose();
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

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Partially Freeze Tokens" />
          <RightAsideContent>
            <TextField
              label="Amount"
              type="number"
              {...register('amount', { required: true })}
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
            <Button onPress={onClose} variant="transparent">
              Cancel
            </Button>
            <SendTransactionAnimation
              onPress={handlePress}
              trigger={
                <Button isDisabled={frozen || paused} type="submit">
                  Distribute
                </Button>
              }
            />
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
