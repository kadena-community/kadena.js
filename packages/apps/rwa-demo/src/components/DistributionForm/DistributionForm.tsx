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
import { useForm } from 'react-hook-form';
import { AssetPausedMessage } from '../AssetPausedMessage/AssetPausedMessage';
import { InvestorFrozenMessage } from '../InvestorFrozenMessage/InvestorFrozenMessage';

interface IProps {
  onClose: () => void;
  investorAccount: string;
}

export const DistributionForm: FC<IProps> = ({ onClose, investorAccount }) => {
  const { frozen } = useFreeze({ investorAccount });
  const { paused } = useAsset();
  const { submit } = useDistributeTokens();
  const { register, handleSubmit } = useForm<IDistributeTokensProps>({
    values: {
      amount: 0,
      investorAccount,
    },
  });

  const onSubmit = async (data: IDistributeTokensProps) => {
    await submit(data);
    onClose();
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
            <Button isDisabled={frozen || paused} type="submit">
              Distribute
            </Button>
          </RightAsideFooter>
        </form>
      </RightAside>
    </>
  );
};
