import type { FC } from 'react';
import React, { useEffect } from 'react';

import { Heading, Select, SelectItem, Stack } from '@kadena/react-ui';

import Link from 'next/link';

import { LoadingCard } from '@/components/Global/LoadingCard';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { AccountDetails } from '@/hooks/use-account-details-query';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import type { DerivationMode } from '@/hooks/use-ledger-public-key';
import { notificationLinkStyle } from '@/pages/transactions/transfer/styles.css';
import type { ChainId } from '@kadena/types';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { SenderFields } from './sender-fields';
import type { FormData } from './sign-form';

export const accountFromOptions = ['Ledger', 'Coming soon…', 'Test'] as const;
export type SenderType = (typeof accountFromOptions)[number];

export interface ISignFormSenderProps {
  onDataUpdate: (data: AccountDetails) => void;
  onKeyIdUpdate: (keyId: number) => void;
  onDerivationUpdate: (derivationMode: DerivationMode) => void;
  onChainUpdate: (chainId: ChainId) => void;
  signingMethod: SenderType;
  onSigningMethodUpdate: (method: SenderType) => void;
}

export const SignFormSender: FC<ISignFormSenderProps> = ({
  onDataUpdate,
  onKeyIdUpdate,
  onDerivationUpdate,
  onChainUpdate,
  signingMethod,
  onSigningMethodUpdate,
}) => {
  const { t } = useTranslation('common');
  const { watch } = useFormContext<FormData>();

  const { selectedNetwork: network } = useWalletConnectClient();

  const [watchSender, watchChain] = watch(['sender', 'senderChainId']);
  const senderData = useAccountDetailsQuery({
    account: watchSender,
    networkId: network,
    chainId: watchChain,
  });

  useEffect(() => {
    if (senderData.isSuccess) {
      onDataUpdate(senderData.data);
    }
  }, [onDataUpdate, senderData.data, senderData.isSuccess]);

  return (
    <LoadingCard fullWidth isLoading={senderData.isFetching}>
      <Heading as={'h5'}>{t('Sender')}</Heading>

      <Stack flexDirection={'row'} justifyContent={'space-between'}>
        <Select
          label="From"
          placeholder="Select an option"
          selectedKey={signingMethod}
          disabledKeys={['Coming soon…']}
          onSelectionChange={(x) => {
            onSigningMethodUpdate(x as SenderType);
          }}
        >
          {accountFromOptions.map((item) => (
            <SelectItem key={item}>{item}</SelectItem>
          ))}
        </Select>
        <Link
          className={notificationLinkStyle}
          href={'https://transfer.chainweb.com/search-ledger-keys.html'}
          target={'_blank'}
          key={'key'}
        >
          {t('forgot-ledger-key-index')}
        </Link>
      </Stack>

      <SenderFields
        type={signingMethod}
        onKeyIdUpdate={onKeyIdUpdate}
        onDerivationUpdate={onDerivationUpdate}
        senderDataQuery={senderData}
        onChainUpdate={onChainUpdate}
      />
    </LoadingCard>
  );
};

export default SignFormSender;
