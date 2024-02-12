// import { AccountHoverTag } from '@/components/Global';
// import { useLedgerPublicKey } from '@/hooks/use-ledger-public-key';
import {
  Card,
  Stack,
  SystemIcon,
  Text,
  ToggleButton,
  TrackerCard,
} from '@kadena/react-ui';
import React, { useState } from 'react';

const TransactionDetails = (transaction: any) => {
  const tx = {
    payload: {
      exec: {
        code: '(n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet.create-and-request-coin "k:18c12f868e4cb825e2cad57e44aa588f8a1d2f392a2a945b50c51634a5429045" (read-keyset "new_keyset") 100.0)',
        data: {
          new_keyset: {
            keys: [
              '18c12f868e4cb825e2cad57e44aa588f8a1d2f392a2a945b50c51634a5429045',
            ],
            pred: 'keys-all',
          },
        },
      },
    },
    nonce: 'kjs:nonce:1707567506729',
    signers: [
      {
        pubKey:
          '332cffee708e0e2b390feb30f81c61d573ff0d8db18f10a218ae9dd34c1cbdc7',
        scheme: 'ED25519',
        clist: [
          {
            name: 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet.GAS_PAYER',
            args: [
              'k:18c12f868e4cb825e2cad57e44aa588f8a1d2f392a2a945b50c51634a5429045',
              { int: 1 },
              { decimal: '1.0' },
            ],
          },
          {
            name: 'coin.TRANSFER',
            args: [
              'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
              'k:18c12f868e4cb825e2cad57e44aa588f8a1d2f392a2a945b50c51634a5429045',
              { decimal: '100.0' },
            ],
          },
        ],
      },
      {
        pubKey:
          '332cffee708e0e2b390feb30f81c61d573ff0d8db18f10a218ae9dd34c1cbdc7',
        scheme: 'ED25519',
        clist: [
          {
            name: 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet.GAS_PAYER',
            args: [
              'k:18c12f868e4cb825e2cad57e44aa588f8a1d2f392a2a945b50c51634a5429045',
              { int: 1 },
              { decimal: '1.0' },
            ],
          },
          {
            name: 'coin.TRANSFER',
            args: [
              'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
              'k:18c12f868e4cb825e2cad57e44aa588f8a1d2f392a2a945b50c51634a5429045',
              { decimal: '100.0' },
            ],
          },
        ],
      },
    ],
    meta: {
      gasLimit: 2500,
      gasPrice: 1e-8,
      sender: 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
      ttl: 28800,
      creationTime: 1707567506,
      chainId: '0',
    },
    networkId: 'testnet04',
  };

  // const [keyId, setKeyId] = useState<number>();
  // const publicKey = useLedgerPublicKey(keyId);
  const [txDetailsExpanded, setTxDetailsExpanded] = useState<boolean>(false);

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
                label: 'Raw',
                value: JSON.stringify(tx),
              },
            ]}
          />
        ) : null}

        <TrackerCard
          variant="vertical"
          labelValues={[
            {
              label: 'Code',
              value: tx.payload.exec.code,
            },
          ]}
        />

        <TrackerCard
          variant="vertical"
          labelValues={[
            {
              label: 'Network',
              value: tx.networkId,
            },
          ]}
        />
        <Text>Capabilities</Text>

        {tx.signers.map((signer) =>
          signer.clist.map((cap) => (
            <div key={cap.name}>
              <TrackerCard
                variant="horizontal"
                labelValues={[
                  {
                    label: 'Name',
                    value: cap.name,
                  },
                  {
                    label: 'Arguments',
                    value: cap.args.map((item) => item.toString()).join(','),
                  },
                  {
                    label: 'Signer',
                    value: signer.pubKey,
                  },
                ]}
              />
            </div>
          )),
        )}
      </Stack>
    </Card>
  );
};

export default TransactionDetails;
