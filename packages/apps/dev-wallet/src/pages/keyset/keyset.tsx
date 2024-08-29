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
} from '@kadena/client-utils/coin';
import { genKeyPair } from '@kadena/cryptography-utils';
import { MonoKey } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { useNavigate, useParams } from 'react-router-dom';

export function Keyset() {
  const { keysetId } = useParams();
  const { profile, activeNetwork } = useWallet();
  const [keyset] = useAsync(accountRepository.getKeyset, keysetId!);
  const [accounts] = useAsync(accountRepository.getAccountByKeyset, keysetId!);
  const navigate = useNavigate();

  if (!keyset || !accounts || !profile || keyset.profileId !== profile.uuid) {
    return null;
  }

  const kdaAccount = accounts.find((account) => account.contract === 'coin');

  async function fundAccount({
    address,
    keyset,
    chains,
  }: Pick<IAccount, 'address' | 'keyset' | 'chains'>) {
    if (!keyset) {
      throw new Error('No keyset found');
    }

    const randomKeyPair = genKeyPair();

    const randomChainId = '1'; // Math.floor(Math.random() * 20).toString();

    const balanceOnChain =
      chains.find((chain) => chain.chainId === randomChainId)?.balance ?? '0';

    const command =
      +balanceOnChain > 0
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
    <Stack flexDirection={'column'} gap={'sm'}>
      {!!keyset.alias && <Heading variant="h3">{keyset.alias}</Heading>}
      <Stack justifyContent={'space-between'}>
        <Heading variant="h2">{shorten(keyset.principal, 15)}</Heading>
        {activeNetwork?.networkId === 'testnet04' && (
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
      <h1>Accounts</h1>
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
    </Stack>
  );
}
