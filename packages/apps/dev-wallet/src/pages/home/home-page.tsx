import { IKeySet } from '@/modules/account/account.repository';
import { useNetwork } from '@/modules/network/network.hook';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  chainListClass,
  listClass,
  listItemClass,
  panelClass,
} from '@/pages/home/style.css.ts';
import { getAccountName } from '@/utils/helpers';
import { Box, Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { linkClass } from '../select-profile/select-profile.css';

import { transactionRepository } from '@/modules/transaction/transaction.repository';
import * as transactionService from '@/modules/transaction/transaction.service';
import {
  ChainId,
  createSignWithKeypair,
  createTransaction,
} from '@kadena/client';
import { fundAccountOnTestnetCommand } from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';

export function HomePage() {
  const { accounts, profile, fungibles } = useWallet();
  const navigate = useNavigate();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState<number>(-1);
  const assets = useMemo(() => {
    return Object.entries(
      accounts.reduce(
        (acc, { contract, overallBalance }) => {
          acc[contract] = new PactNumber(overallBalance)
            .plus(acc[contract] ?? 0)
            .toDecimal();
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
  }, [accounts]);

  const { activeNetwork } = useNetwork();
  console.log('activeNetwork', activeNetwork);

  async function fundAccount({
    address,
    guard,
  }: {
    address: string;
    guard: IKeySet['guard'];
  }) {
    const randomKeyPair = genKeyPair();

    const randomChainId = Math.floor(Math.random() * 20).toString();

    const command = fundAccountOnTestnetCommand({
      account: address,
      keyset: guard,
      signerKeys: [randomKeyPair.publicKey],
      amount: 20,
      chainId: randomChainId as ChainId,
    });

    const tx = createTransaction(command());

    const signedTx = await createSignWithKeypair(randomKeyPair)(tx);

    const groupId = crypto.randomUUID();

    const result = await transactionService.addTransaction(
      signedTx,
      profile!.uuid,
      'testnet04',
      groupId,
    );

    await transactionRepository.updateTransaction({
      ...result,
      status: 'signed',
    });

    navigate(`/transaction/${groupId}`);
  }

  return (
    <>
      <Box>
        <Text>Welcome back</Text>
        <Heading as="h1">{profile?.name}</Heading>
        <Box className={panelClass} marginBlockStart="xl">
          <Heading as="h4">Your assets</Heading>
          <Box marginBlockStart="md">
            {assets.length > 0 &&
              assets.map(([contract, balance]) => (
                <Heading variant="h5" key={contract}>
                  {fungibles.find((item) => item.contract === contract)?.symbol}
                  : {balance}
                </Heading>
              ))}
          </Box>
        </Box>
        <Box className={panelClass} marginBlockStart="xs">
          <Heading as="h4">{accounts.length} accounts</Heading>
          <Link to="/create-account" className={linkClass}>
            Create Account
          </Link>
          <Box marginBlockStart="md">
            <Text>Owned ({accounts.length})</Text>
            {accounts.length ? (
              <ul className={listClass}>
                {accounts.map(
                  ({ address, overallBalance, chains, keyset }, idx) => (
                    <li key={address}>
                      <Stack
                        justifyContent="space-between"
                        alignItems={'center'}
                        className={listItemClass}
                        onClick={() => {
                          setSelectedAccountIdx((cu) => {
                            return cu === idx ? -1 : idx;
                          });
                        }}
                      >
                        <Text>
                          {getAccountName(address) ?? 'No Address ;(!'}
                        </Text>
                        <Stack alignItems={'center'} gap={'sm'}>
                          {activeNetwork?.networkId === 'testnet04' && (
                            <Button
                              variant="info"
                              isCompact
                              onPress={() => {
                                if (!keyset) {
                                  throw new Error('No keyset found');
                                }
                                fundAccount({ address, guard: keyset.guard });
                              }}
                            >
                              Fund
                            </Button>
                          )}
                          <Text>{overallBalance} KDA</Text>
                        </Stack>
                      </Stack>
                      {selectedAccountIdx === idx && chains.length > 0 && (
                        <ul className={chainListClass}>
                          {chains.map(({ chainId, balance }) => (
                            <li key={address}>
                              <Stack
                                justifyContent="space-between"
                                className={listItemClass}
                              >
                                <Text>chain {chainId}</Text>
                                <Text>{balance} KDA</Text>
                              </Stack>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ),
                )}
              </ul>
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  );
}
