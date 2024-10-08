import { Assets } from '@/Components/Assets/Assets';
import {
  accountRepository,
  IAccount,
} from '@/modules/account/account.repository';
import { transactionRepository } from '@/modules/transaction/transaction.repository';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { useAsync } from '@/utils/useAsync';
import {
  ChainId,
  createSignWithKeypair,
  createTransaction,
} from '@kadena/client';
import {
  fundExistingAccountOnTestnetCommand,
  fundNewAccountOnTestnetCommand,
  readHistory,
} from '@kadena/client-utils/faucet';
import { genKeyPair } from '@kadena/cryptography-utils';
import { MonoKey } from '@kadena/kode-icons/system';
import { Box, Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { useNavigate, useParams } from 'react-router-dom';
import { panelClass } from './style.css';

export function Keyset() {
  const { keysetId } = useParams();
  const { profile, activeNetwork, fungibles } = useWallet();
  const [keyset] = useAsync(
    (id) => (id ? accountRepository.getKeyset(id) : Promise.reject('no ide')),
    [keysetId],
  );
  const [accounts] = useAsync(
    (id) =>
      id ? accountRepository.getAccountByKeyset(id) : Promise.reject('no id'),
    [keysetId],
  );
  const navigate = useNavigate();

  if (!keyset || !accounts || !profile || keyset.profileId !== profile.uuid) {
    return null;
  }

  const kdaAccount = accounts.find((account) => account.contract === 'coin');

  async function fundAccount({
    address,
    keyset,
  }: Pick<IAccount, 'address' | 'keyset' | 'chains'>) {
    if (!keyset) {
      throw new Error('No keyset found');
    }

    const randomKeyPair = genKeyPair();

    const randomChainId = Math.floor(Math.random() * 20).toString();

    const isCreated = await readHistory(address, randomChainId as ChainId)
      .then(() => true)
      .catch(() => false);

    const command = isCreated
      ? fundExistingAccountOnTestnetCommand({
          account: address,
          signerKeys: [randomKeyPair.publicKey],
          amount: 20,
          chainId: randomChainId as ChainId,
        })
      : fundNewAccountOnTestnetCommand({
          account: address,
          keyset: keyset?.guard,
          signerKeys: [randomKeyPair.publicKey],
          amount: 20,
          chainId: randomChainId as ChainId,
        });

    const tx = createTransaction(command());

    const signedTx = await createSignWithKeypair(randomKeyPair)(tx);

    const groupId = crypto.randomUUID();

    const result = await transactionService.addTransaction({
      transaction: signedTx,
      profileId: profile!.uuid,
      networkId: 'testnet05',
      groupId,
    });

    await transactionRepository.updateTransaction({
      ...result,
      status: 'signed',
    });

    navigate(`/transaction/${groupId}`);
  }

  return (
    <Stack flexDirection={'column'} gap={'sm'}>
      {!!keyset.alias && <Heading variant="h3">{keyset.alias}</Heading>}
      <Stack justifyContent={'space-between'}>
        <Heading variant="h2">{shorten(keyset.principal, 15)}</Heading>
        {activeNetwork?.networkId === 'testnet05' && (
          <Button
            variant="positive"
            isCompact
            onPress={() => {
              if (!keyset) {
                throw new Error('No keyset found');
              }
              fundAccount({
                address: kdaAccount?.address ?? keyset.principal,
                keyset,
                chains: kdaAccount?.chains ?? [],
              });
            }}
          >
            Fund
          </Button>
        )}
      </Stack>
      <Stack flexWrap="wrap" flexDirection={'row'} gap="md">
        <Text>{keyset.guard.pred}:</Text>
        {keyset.guard.keys.map((key) => (
          <Stack key={key} gap="sm" alignItems={'center'}>
            <Text>
              <MonoKey />
            </Text>
            <Text variant="code">{shorten(key)}</Text>
          </Stack>
        ))}
      </Stack>

      <Stack
        alignItems={'center'}
        gap={'sm'}
        justifyContent={'flex-end'}
      ></Stack>
      <Box className={panelClass} marginBlockStart="xl">
        <Box marginBlockStart={'sm'}>
          <Assets accounts={accounts} fungibles={fungibles} />
        </Box>
      </Box>
    </Stack>
  );
}
