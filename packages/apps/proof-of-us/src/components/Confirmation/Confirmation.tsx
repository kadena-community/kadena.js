import { Button } from '@/components/Button/Button';
import { Modal } from '@/components/Modal/Modal';
import { Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import { useState } from 'react';

interface IProps extends PropsWithChildren {
  text: string;
  action: () => void;
}

export const Confirmation: FC<IProps> = ({ text, children, action }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <div>
      <span onClick={() => setIsShown(true)}>{children}</span>
      {isShown ? (
        <Modal label="Confirm action" onClose={() => setIsShown(false)}>
          {text}
          <Stack gap="md" marginBlockStart="md">
            <Button variant="secondary" onClick={() => setIsShown(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={action}>
              Confirm
            </Button>
          </Stack>
        </Modal>
      ) : null}
    </div>
  );
};
