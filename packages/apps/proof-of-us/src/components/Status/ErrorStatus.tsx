import { MonoClose } from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../Button/Button';
import { MessageBlock } from '../MessageBlock/MessageBlock';
import { Heading } from '../Typography/Heading';

interface IProps extends PropsWithChildren {
  closeUrl?: string;
  handleMint?: () => Promise<void>;
}

export const ErrorStatus: FC<IProps> = ({ children, closeUrl, handleMint }) => {
  return (
    <>
      <Stack justifyContent="center" paddingBlock="xxxl">
        <MonoClose fontSize="8rem" />
      </Stack>

      <Stack flex={1} />
      <Stack flexDirection="column" gap="md">
        <Heading as="h6">Transaction Failed</Heading>
        <MessageBlock title="Error" variant="error">
          {children}
        </MessageBlock>
        <Stack gap="md">
          {closeUrl && (
            <Link href={closeUrl}>
              <Button>Go to dashboard</Button>
            </Link>
          )}
          {handleMint && (
            <Button variant="tertiary" onPress={handleMint}>
              Retry
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};
