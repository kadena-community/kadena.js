import { Connect } from '@/pages/connect/connect';
import {
  Dialog,
  DialogHeader,
  DialogHeaderSubtitle,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { useState } from 'react';
import { Plugin } from '../../../modules/plugins/type';

export function ConnectionRequest({
  requestId,
  plugin,
  onDone,
}: {
  requestId: string;
  plugin: Plugin;
  onDone: () => void;
}) {
  const [isOpened, setIsOpened] = useState(true);
  const close = () => {
    setIsOpened(false);
    onDone();
  };
  return (
    <Dialog isOpen={isOpened}>
      <DialogHeader>Connection Request</DialogHeader>
      <DialogHeaderSubtitle>
        <Stack gap={'sm'} flexDirection={'row'}>
          <Text bold color="emphasize">
            {plugin.name}
          </Text>{' '}
          <Text> wants to connect to your wallet</Text>
        </Stack>
      </DialogHeaderSubtitle>
      <Connect requestId={requestId} onAccept={close} onReject={close} />
    </Dialog>
  );
}
