import {
  accountRepository,
  IAccount,
} from '@/modules/account/account.repository';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
  useLayout,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';

export function AliasForm({
  show,
  account,
}: {
  show: boolean;
  account: IAccount;
}) {
  const { setIsRightAsideExpanded } = useLayout();
  const [aliasVal, setAliasVal] = useState(account.alias || '');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await accountRepository.updateAccount({
      ...account,
      alias: aliasVal,
    });
    setIsRightAsideExpanded(false);
  }

  return (
    <RightAside isOpen={show}>
      <RightAsideHeader label="Account Alias" />
      <RightAsideContent>
        <form onSubmit={onSubmit}>
          <Stack gap={'md'} flexDirection={'column'} padding={'md'}>
            <TextField
              type="text"
              label="Alias"
              placeholder="Enter an alias for this account"
              value={aliasVal}
              onChange={(e) => {
                setAliasVal(e.target.value);
              }}
            />
            <Stack
              gap={'md'}
              justifyContent={'flex-end'}
              marginBlockStart={'lg'}
            >
              <Button
                variant="transparent"
                onClick={() => setIsRightAsideExpanded(false)}
              >
                Close
              </Button>
              <Button type="submit">Save</Button>
            </Stack>
          </Stack>
        </form>
      </RightAsideContent>
    </RightAside>
  );
}
