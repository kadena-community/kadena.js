// import { useLedgerPublicKey } from '@/hooks/use-ledger-public-key';
import type { IExecutionPayloadObject } from '@kadena/client';
import {
  Card,
  Stack,
  SystemIcon,
  Text,
  ToggleButton,
  TrackerCard,
} from '@kadena/react-ui';
import type { ICap } from '@kadena/types';
import useTranslation from 'next-translate/useTranslation';
import React, { useState } from 'react';

export interface ITransactionDetails {
  transaction: any;
}
const TransactionDetails = ({
  transaction,
}: ITransactionDetails): React.JSX.Element | null => {
  const { t } = useTranslation('common');
  // const [keyId, setKeyId] = useState<number>();
  // const publicKey = useLedgerPublicKey(keyId);
  const [txDetailsExpanded, setTxDetailsExpanded] = useState<boolean>(false);

  if (!transaction) return null;

  // @ts-ignore
  return (
    <Card fullWidth={true}>
      <Stack flexDirection={'column'} gap={'sm'}>
        <ToggleButton
          isSelected={txDetailsExpanded}
          onChange={() => setTxDetailsExpanded(!txDetailsExpanded)}
          startIcon={
            txDetailsExpanded ? (
              <SystemIcon.ChevronUp />
            ) : (
              <SystemIcon.ChevronDown />
            )
          }
        >
          Transaction
        </ToggleButton>
        {txDetailsExpanded ? (
          <TrackerCard
            variant={'vertical'}
            labelValues={[
              {
                label: t('Raw'),
                value: JSON.stringify(transaction),
              },
            ]}
          />
        ) : null}

        {transaction.payload ? (
          <TrackerCard
            variant="vertical"
            labelValues={[
              {
                label: t('Code'),
                value: (transaction.payload as IExecutionPayloadObject).exec
                  .code,
              },
            ]}
          />
        ) : null}

        <TrackerCard
          variant="vertical"
          labelValues={[
            {
              label: t('Network'),
              value: transaction.networkId,
            },
          ]}
        />
        <Text>{t('Capabilities')}</Text>

        {transaction.signers
          ? transaction.signers.map((signer: any) =>
              signer.clist.map((cap: ICap) => (
                <div key={cap.name}>
                  <TrackerCard
                    variant="horizontal"
                    labelValues={[
                      {
                        label: t('Name'),
                        value: cap.name,
                      },
                      {
                        label: t('Arguments'),
                        value: cap.args
                          .map((item) => item.toString())
                          .join(','),
                      },
                      {
                        label: t('Signer'),
                        value: signer.pubKey,
                      },
                    ]}
                  />
                </div>
              )),
            )
          : null}
      </Stack>
    </Card>
  );
};

export default TransactionDetails;
