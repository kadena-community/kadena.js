import { useAccount } from '@/hooks/account';
import { useFreeze } from '@/hooks/freeze';
import { MonoCompareArrows } from '@kadena/kode-icons';
import { Button, Stack } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';
import { useState } from 'react';
import { InvestorInfo } from '../InvestorInfo/InvestorInfo';
import { TransferForm } from '../TransferForm/TransferForm';

export const InvestorRootPage: FC = () => {
  const { isInvestor, account } = useAccount();
  const { frozen } = useFreeze({ investorAccount: account?.address! });
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [hasOpenTransferForm, setHasOpenTransferForm] = useState(false);

  const handleTransferTokens = () => {
    setIsRightAsideExpanded(true);
    setHasOpenTransferForm(true);
  };

  if (!isInvestor || !account) return null;

  return (
    <>
      {isRightAsideExpanded && hasOpenTransferForm && (
        <TransferForm
          onClose={() => {
            setIsRightAsideExpanded(false);
            setHasOpenTransferForm(false);
          }}
        />
      )}

      <Stack width="100%" flexDirection="column" gap="md">
        <InvestorInfo investorAccount={account.address} />

        <Stack gap="sm">
          <Button
            startVisual={<MonoCompareArrows />}
            onPress={handleTransferTokens}
            isDisabled={frozen}
          >
            Transfer tokens
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
