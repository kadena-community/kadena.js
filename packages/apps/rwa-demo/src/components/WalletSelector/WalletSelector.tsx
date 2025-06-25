import type { WALLETTYPES } from '@/constants';
import { useAccount } from '@/hooks/account';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import {
  Button,
  ContextMenu,
  Dialog,
  DialogContent,
  DialogHeader,
  maskValue,
  Stack,
  Text,
} from '@kadena/kode-ui';
import type { Attributes, FC, ReactElement } from 'react';
import { useState } from 'react';
import { ChainweaverWalletConnect } from '../ChainweaverWalletConnect/ChainweaverWalletConnect';
import { EckoWalletConnect } from '../EckoWalletConnect/EckoWalletConnect';
import { MagicConnect } from '../MagicConnect/MagicConnect';

export const WalletSelector: FC<{
  trigger: ReactElement<
    Partial<HTMLButtonElement> &
      Attributes & {
        onPress?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
      }
  >;
}> = ({ trigger }) => {
  const [accounts, setAccounts] = useState<IWalletAccount[] | undefined>();
  const [type, setType] = useState<keyof typeof WALLETTYPES | undefined>();
  const { addAccount } = useAccount();

  const handleConnect = async (type: keyof typeof WALLETTYPES) => {
    setType(type);
    const result = await addAccount(type);
    setAccounts(result);
  };

  const selectAccount = async (account: IWalletAccount) => {
    if (!type) return;
    await addAccount(type, account);
    setAccounts([]);
  };

  return (
    <>
      {accounts && accounts.length > 1 && (
        <Dialog isOpen>
          <DialogHeader>Select an account</DialogHeader>
          <DialogContent>
            <Stack flexDirection="column" width="100%" gap="xl">
              <Text>Select 1 of your accounts:</Text>

              <Stack
                as="ul"
                flexDirection="column"
                gap="md"
                style={{ paddingInline: '0' }}
              >
                {accounts.map((account) => (
                  <Stack as="li" key={account.address} width="100%">
                    <Button
                      onPress={() => selectAccount(account)}
                      style={{ width: '100%' }}
                    >
                      {account.alias
                        ? account.alias
                        : maskValue(account.address)}
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>
      )}

      <ContextMenu trigger={trigger}>
        <MagicConnect handleConnect={handleConnect} />
        <EckoWalletConnect handleConnect={handleConnect} />
        <ChainweaverWalletConnect handleConnect={handleConnect} />
      </ContextMenu>
    </>
  );
};
