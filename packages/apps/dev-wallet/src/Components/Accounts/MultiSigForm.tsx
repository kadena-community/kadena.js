import { CreateAccount } from '@/pages/create-account/create-account';
import { Stack } from '@kadena/kode-ui';
import {
  RightAside,
  RightAsideContent,
  RightAsideHeader,
} from '@kadena/kode-ui/patterns';

export function MultiSigForm({
  contract,
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  contract: string;
  onClose: () => void;
}) {
  return (
    <RightAside isOpen={isOpen} onClose={onClose}>
      <RightAsideHeader label="Create Multi-sig Account" />
      <RightAsideContent>
        <Stack gap={'xl'} flexDirection={'column'}>
          <CreateAccount
            initialContract={contract}
            onCreated={() => onClose()}
            onCancel={() => onClose()}
          />
        </Stack>
      </RightAsideContent>
    </RightAside>
  );
}
