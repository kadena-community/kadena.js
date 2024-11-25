import type { PressEvent } from '@kadena/kode-ui';
import { Button, Dialog, DialogContent, DialogFooter } from '@kadena/kode-ui';

import type { FC, PropsWithChildren } from 'react';
import React, { useState } from 'react';

interface IProps extends PropsWithChildren {
  trigger: React.ReactElement;
  label?: string;
  onPress: (e: PressEvent) => void;
}
export const Confirmation: FC<IProps> = ({
  children,
  trigger,
  label = 'ok',
  onPress,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (e: any) => {
    setIsOpen(false);
    onPress(e);
  };

  return (
    <>
      {React.cloneElement(trigger, {
        ...trigger.props,
        onPress: () => setIsOpen(true),
      })}

      <Dialog isOpen={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent>{children}</DialogContent>
        <DialogFooter>
          <Button variant="outlined" onPress={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onPress={handleAction}>
            {label}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
