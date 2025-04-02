import {
  accountRepository,
  Fungible,
} from '@/modules/account/account.repository';
import { INetwork } from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { queryAllChainsClient } from '@kadena/client-utils/core';
import { composePactCommand, execution } from '@kadena/client/fp';
import {
  Button,
  Divider,
  Heading,
  Notification,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideFooter,
  RightAsideHeader,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ButtonItem } from '../ButtonItem/ButtonItem';

interface TokenForm {
  contract: string;
  symbol: string;
}

const checkContract = async (contract: string, networkId: string) => {
  const result = await queryAllChainsClient({
    defaults: {
      networkId: networkId,
    },
  })(
    composePactCommand(execution(`(describe-module "${contract}")`)),
  ).execute();
  console.log('result', result);
  if (result.every((r) => r.result === undefined)) {
    throw new Error(`INVALID_CONTRACT: Contract not found on ${networkId}`);
  }
  const fv2 = result.filter(
    (r) => r.result && (r.result as any).interfaces.includes('fungible-v2'),
  );
  if (fv2.length === 0) {
    throw new Error('INVALID_CONTRACT: Only fungible-v2 tokens are supported');
  }
};

export function AddTokenForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit } = useForm<TokenForm>({
    defaultValues: {
      contract: '',
      symbol: '',
    },
  });

  const { activeNetwork, fungibles } = useWallet();
  const { setIsRightAsideExpanded } = useSideBarLayout();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: TokenForm) {
    const { contract, symbol } = data;
    if (!activeNetwork) {
      throw new Error('Network not selected');
    }
    setError(null);
    try {
      checkContract(contract, activeNetwork.networkId);

      const token: Fungible = {
        contract,
        symbol,
        title: symbol,
        interface: 'fungible-v2',
        networkUUIDs: [activeNetwork.uuid],
      } as const;

      await accountRepository.addFungible(token);
      setIsRightAsideExpanded(false);
    } catch (e: any) {
      setError(e?.message || e);
    }
  }

  async function addExistingToken(fungible: Fungible, network: INetwork) {
    if (!fungible.networkUUIDs) return;
    setError(null);
    try {
      await checkContract(fungible.contract, network.networkId);
      await accountRepository.updateFungible({
        ...fungible,
        networkUUIDs: [...fungible.networkUUIDs, network.uuid],
      });
      setIsRightAsideExpanded(false);
    } catch (e: any) {
      setError(e?.message || e);
    }
  }

  return (
    <RightAside isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RightAsideHeader label="Add Asset" />
        <RightAsideContent>
          <Stack flexDirection={'column'} gap={'lg'}>
            <Stack flexDirection={'column'} gap={'md'}>
              <Heading variant={'h5'}>Add from existing Tokens</Heading>
              {fungibles.map((f) => {
                const installed =
                  !f.networkUUIDs ||
                  f.networkUUIDs.includes(activeNetwork!.uuid);
                return (
                  <ButtonItem
                    key={f.contract}
                    title={f.symbol}
                    disabled={
                      !f.networkUUIDs ||
                      f.networkUUIDs.includes(activeNetwork!.uuid)
                    }
                    onClick={async (e) => {
                      e.preventDefault();
                      if (!activeNetwork) {
                        throw new Error('Network not selected');
                      }
                      await addExistingToken(f, activeNetwork);
                    }}
                  >
                    <Stack
                      gap={'sm'}
                      width="100%"
                      justifyContent={'space-between'}
                    >
                      <Stack gap={'sm'}>
                        <Text>
                          {f.symbol}({f.contract})
                        </Text>
                      </Stack>
                      <Text>{installed && 'Already Installed'}</Text>
                    </Stack>
                  </ButtonItem>
                );
              })}
            </Stack>
            <Divider />
            <Stack flexDirection={'column'} gap={'md'}>
              <Heading variant={'h5'}>Add New Token</Heading>
              <Stack width="100%" flexDirection="column" gap="md">
                <TextField
                  autoFocus
                  label="SmartContract"
                  {...register('contract', { required: true })}
                />
                <TextField
                  label="Symbol"
                  {...register('symbol', { required: true })}
                />
                {error && <Notification role="alert">{error}</Notification>}
              </Stack>
            </Stack>
          </Stack>
        </RightAsideContent>
        <RightAsideFooter>
          <Button
            variant="outlined"
            onPress={() => {
              setIsRightAsideExpanded(false);
            }}
            type="reset"
          >
            Cancel
          </Button>
          <Button type="submit">Add Token</Button>
        </RightAsideFooter>
      </form>
    </RightAside>
  );
}
