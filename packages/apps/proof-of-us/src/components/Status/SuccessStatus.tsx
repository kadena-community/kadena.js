import { Stack } from '@kadena/kode-ui';
import { MonoChecklist } from '@kadena/react-icons';
import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../Button/Button';
import { ListSignees } from '../ListSignees/ListSignees';
import { MessageBlock } from '../MessageBlock/MessageBlock';
import { Heading } from '../Typography/Heading';

interface IProps extends PropsWithChildren {
  handleClose?: () => void;
  href?: string;
}
export const SuccessStatus: FC<IProps> = ({ children, handleClose, href }) => {
  return (
    <>
      <Stack justifyContent="center" paddingBlock="xxxl">
        <MonoChecklist fontSize="8rem" />
      </Stack>
      <ListSignees />
      <Stack flex={1} />
      <Stack flexDirection="column" gap="md">
        <Heading as="h6">Transaction Completed</Heading>
        <MessageBlock title="Success" variant="success">
          {children}
        </MessageBlock>
        <Stack gap="md">
          {handleClose && (
            <Button variant="secondary" onPress={handleClose}>
              Dashboard
            </Button>
          )}

          {href && (
            <Link href={href}>
              <Button variant="primary">Go to Proof</Button>
            </Link>
          )}
        </Stack>
      </Stack>
    </>
  );
};
