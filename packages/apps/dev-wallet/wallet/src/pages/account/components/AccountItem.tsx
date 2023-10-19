import { Account } from "@/hooks/accounts.hook";
import { IconButton, Stack, SystemIcon } from "@kadena/react-ui";
import { useCopyToClipboard } from "usehooks-ts";

export const AccountItem = ({ account }: { account: Account }) => {
  const [, copy] = useCopyToClipboard();
  return (
    <Stack direction="row" gap="$xs" alignItems="center">
      <SystemIcon.BadgeAccount />
      {account.account}
      <IconButton
        icon="ContentCopy"
        title="Copy key"
        onClick={() => copy(account.account)}
      />
    </Stack>
  );
};
