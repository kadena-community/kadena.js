import type { PressEvent } from '@kadena/kode-ui';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Stack,
} from '@kadena/kode-ui';

import type { FC, PropsWithChildren } from 'react';
import React, { useState } from 'react';
import { complianceWrapperClass } from './style.css';

interface IProps extends PropsWithChildren {
  trigger: React.ReactElement<{ onPress: () => void }>;
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

      {isOpen && (
        <Stack className={complianceWrapperClass}>
          <Dialog isOpen onOpenChange={() => setIsOpen(false)}>
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
        </Stack>
      )}
    </>
  );
};
