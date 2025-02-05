import {
  accountRepository,
  IKeysetGuard,
  IOwnedAccount,
} from '@/modules/account/account.repository.ts';

import { useWallet } from '@/modules/wallet/wallet.hook';

import { KeySetForm } from '@/Components/KeySetForm/KeySetForm.tsx';

import {
  Button,
  Card,
  Heading,
  Select,
  SelectItem,
  Stack,
  Text,
  TextField,
} from '@kadena/kode-ui';

import { shorten } from '@/utils/helpers';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Label } from '../transaction/components/helpers';

export function CreateAccount({
  initialContract,
  onCreated,
  onCancel,
}: {
  initialContract: string;
  onCreated: (account: IOwnedAccount) => void;
  onCancel: () => void;
}) {
  const [keysetGuard, setKeysetGuard] = useState<IKeysetGuard>();
  const [contract, setContract] = useState<string | null>(initialContract);
  const [alias, setAlias] = useState<string | null>(null);
  const { profile, activeNetwork, fungibles, accounts } = useWallet();

  const filteredAccounts = accounts.filter(
    (account) => account.contract === contract,
  );

  const symbol =
    fungibles.find((f) => f.contract === contract)?.symbol ?? contract;

  const aliasDefaultValue = contract
    ? `${contract === 'coin' ? '' : `${symbol} `}Account ${filteredAccounts.length + 1}`
    : '';

  const createAccountByKeyset = async (keyset: IKeysetGuard) => {
    if (!profile || !activeNetwork || !contract) {
      throw new Error('Profile or active network not found');
    }
    const account: IOwnedAccount = {
      uuid: crypto.randomUUID(),
      alias: alias || aliasDefaultValue,
      profileId: profile.uuid,
      address: keyset.principal,
      guard: keyset,
      networkUUID: activeNetwork.uuid,
      contract,
      chains: [],
      overallBalance: '0',
    };

    await accountRepository.addAccount(account);

    onCreated(account);
  };

  return (
    <>
      <Stack flexDirection={'column'} gap={'xxl'}>
        <Heading variant="h3">Create Multi-sig Account</Heading>
        <Stack flexDirection={'column'} gap={'xxl'}>
          <Select
            label="Fungible Contract"
            selectedKey={contract}
            onSelectionChange={(key) => setContract(key as string)}
          >
            {fungibles.map((fungible) => (
              <SelectItem key={fungible.contract} textValue={fungible.contract}>
                {fungible.symbol} ({fungible.contract})
              </SelectItem>
            ))}
          </Select>
          <TextField
            label="Alias"
            defaultValue={aliasDefaultValue}
            value={alias || aliasDefaultValue}
            onChange={(e) => setAlias(e.target.value)}
          />

          <KeySetForm
            isOpen
            close={() => {}}
            variant="inline"
            keyset={keysetGuard}
            onChange={(data) => {
              if (!data) {
                setKeysetGuard(undefined);
                return;
              }
              const { alias: keysetAlias, ...keyset } = data;
              setKeysetGuard(keyset);
              if (keysetAlias && !alias) {
                setAlias(keysetAlias);
              }
            }}
            LiveForm
          />
        </Stack>
        {keysetGuard && (
          <Stack gap={'sm'} flexDirection={'column'}>
            <Label bold>Address:</Label>
            <Text variant="code">{shorten(keysetGuard.principal, 14)}</Text>
          </Stack>
        )}
        <Stack gap="sm">
          <Button variant="transparent" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            isDisabled={!keysetGuard}
            onClick={() => {
              if (keysetGuard) {
                createAccountByKeyset(keysetGuard);
              }
            }}
          >
            <>Create account</>
          </Button>
        </Stack>
      </Stack>
    </>
  );
}

export const CreateAccountPage = () => {
  const navigate = usePatchedNavigate();
  const [searchParams] = useSearchParams();
  const urlContract = searchParams.get('contract');
  return (
    <Stack style={{ maxWidth: '670px', width: '100%' }}>
      <Card fullWidth>
        <CreateAccount
          initialContract={urlContract ?? 'coin'}
          onCreated={() => navigate('/')}
          onCancel={() => navigate('/')}
        />
      </Card>
    </Stack>
  );
};
