import { Button } from '@/components/Button/Button';
import { showModalBtnClass } from '@/components/Confirmation/styles.css';
import { Modal } from '@/components/Modal/Modal';
import { Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import { useState } from 'react';

interface IProps extends PropsWithChildren {
  text: string;
  action: () => void;
  showModalBtnWrapperClass?: string;
}

export const Confirmation: FC<IProps> = ({
  text,
  children,
  action,
  showModalBtnWrapperClass,
}) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsShown(true)}
        className={showModalBtnWrapperClass}
      >
        <div className={showModalBtnClass}>{children}</div>
      </div>
      {isShown ? (
        <Modal label="Confirm action" onClose={() => setIsShown(false)}>
          {text}
          <Stack gap="md" marginBlockStart="md">
            <Button variant="secondary" onPress={() => setIsShown(false)}>
              Cancel
            </Button>
            <Button type="submit" onPress={action}>
              Confirm
            </Button>
          </Stack>
        </Modal>
      ) : null}
    </>
  );
};
