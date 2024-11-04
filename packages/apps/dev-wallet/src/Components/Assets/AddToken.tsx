import { accountRepository } from '@/modules/account/account.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { queryAllChainsClient } from '@kadena/client-utils/core';
import { composePactCommand, execution } from '@kadena/client/fp';
import { Button, Notification, Stack, TextField } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface TokenForm {
  contract: string;
  symbol: string;
}

export function AddToken() {
  const { register, handleSubmit } = useForm<TokenForm>({
    defaultValues: {
      contract: '',
      symbol: '',
    },
  });

  const { activeNetwork } = useWallet();
  const { handleSetAsideExpanded } = useLayout();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: TokenForm) {
    const { contract, symbol } = data;
    setError(null);
    try {
      const result = await queryAllChainsClient({
        defaults: {
          networkId: activeNetwork?.networkId,
        },
      })(
        composePactCommand(execution(`(describe-module "${contract}")`)),
      ).execute();
      console.log('result', result);
      if (result.every((r) => r.result === undefined)) {
        throw new Error('INVALID_CONTRACT: Contract not found');
      }
      const fv2 = result.filter(
        (r) => r.result && (r.result as any).interfaces.includes('fungible-v2'),
      );
      if (fv2.length === 0) {
        throw new Error(
          'INVALID_CONTRACT: Only fungible-v2 tokens are supported',
        );
      }

      const token = {
        contract,
        symbol,
        title: symbol,
        interface: 'fungible-v2',
        chainIds: fv2.map(({ chainId }) => chainId!),
      } as const;

      await accountRepository.addFungible(token);
      handleSetAsideExpanded(false);
    } catch (e: any) {
      setError(e?.message || e);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack flexDirection={'column'} gap={'md'}>
        <TextField
          label="SmartContract"
          {...register('contract', { required: true })}
        />
        <TextField label="Symbol" {...register('symbol', { required: true })} />
        {error && <Notification role="alert">{error}</Notification>}
        <Stack width="100%" justifyContent="flex-end" gap="md">
          <Button type="submit">Add Token</Button>
        </Stack>
      </Stack>
    </form>
  );
}
