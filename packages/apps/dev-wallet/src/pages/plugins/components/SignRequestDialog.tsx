import { SignRequest } from '@/pages/transaction/sign-request';
import { Dialog, DialogContent, DialogHeader } from '@kadena/kode-ui';

import { useState } from 'react';
import { Plugin } from '../type';

export function SignRequestDialog({
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
      <DialogHeader>{`Sign Request from ${plugin.name}`} </DialogHeader>
      <DialogContent>
        <SignRequest requestId={requestId} onAbort={close} onSign={close} />
      </DialogContent>
    </Dialog>
  );
}
