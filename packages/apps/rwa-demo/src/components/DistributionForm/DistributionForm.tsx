import { useAsset } from '@/hooks/asset';
import { useDistributeTokens } from '@/hooks/distributeTokens';
import { useFreeze } from '@/hooks/freeze';
import type { IDistributeTokensProps } from '@/services/distributeTokens';
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

export const DistributionForm: FC<IProps> = ({ onClose, investorAccount }) => {
  const { frozen } = useFreeze({ investorAccount });
  const [tx, setTx] = useState<ITransaction>();
  const resolveRef = useRef<Function | null>(null);
  const { paused } = useAsset();
  const { submit } = useDistributeTokens();
  const { register, handleSubmit } = useForm<IDistributeTokensProps>({
    values: {
      amount: 0,
      investorAccount,
    },
  });

  const onSubmit = async (data: IDistributeTokensProps) => {
    const transaction = await submit(data);
    setTx(transaction);

    return transaction;
  };

  useEffect(() => {
    if (tx && resolveRef.current) {
      resolveRef.current(tx);
      // resolveRef.current = null; // Clean up after resolving
    }
  }, [tx]); // Dependency on state changes

  const waitForStateChange = () => {
    return new Promise((resolve) => {
      resolveRef.current = resolve; // Store the resolver
    });
  };

  const handlePress = async () => {
    console.log(1);
    const message = await waitForStateChange();
    console.log(2, message);

    return message;
  };

  return (
    <>
      <RightAside isOpen onClose={onClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RightAsideHeader label="Distribute Tokens" />
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
