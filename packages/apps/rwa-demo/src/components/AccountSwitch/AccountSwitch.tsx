import { useAccount } from '@/hooks/account';
import { MonoMoreVert, MonoWallet } from '@kadena/kode-icons';
import {
  Button,
  ButtonGroup,
  ContextMenu,
  ContextMenuItem,
  maskValue,
  Stack,
} from '@kadena/kode-ui';
import type { FC } from 'react';
import { assetsSwitchWrapperClass } from './style.css';

export const AccountSwitch: FC<{ showLabel?: boolean }> = ({
  showLabel = true,
}) => {
  const { account, accounts, selectAccount } = useAccount();

  return (
    <Stack width="100%" className={assetsSwitchWrapperClass}>
      <ButtonGroup fullWidth>
        {showLabel && (
          <>
            <Button
              textAlign="start"
              startVisual={<MonoWallet />}
              isCompact
              variant="outlined"
              style={{ flex: 1 }}
            >
              {account ? maskValue(account.address) : 'Select an account'}
            </Button>
          </>
        )}

        <ContextMenu
          trigger={
            <Button
              isCompact
              variant="outlined"
              startVisual={showLabel ? <MonoMoreVert /> : <MonoWallet />}
            />
          }
        >
          {accounts?.map((account) => (
            <ContextMenuItem
              onClick={() => selectAccount(account.address)}
              key={account.address}
              label={maskValue(account.address)}
            />
          ))}

          {accounts?.length === 0 && (
            <ContextMenuItem onClick={() => {}} label="No accounts yet" />
          )}
        </ContextMenu>
      </ButtonGroup>
    </Stack>
  );
};
