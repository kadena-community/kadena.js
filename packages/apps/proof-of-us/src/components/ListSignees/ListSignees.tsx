import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { Heading } from '../Typography/Heading';
import { Signee } from './Signee';
import { multipleWrapperClass, wrapperClass } from './style.css';

export const ListSignees: FC = () => {
  const { signees } = useProofOfUs();
  if (!signees) return null;

  const initiator = signees.find((s) => s.initiator);
  const restSignees = signees.filter((s) => !s.initiator) ?? [];

  const isMultiple = signees.length > 2;
  return (
    <Stack flexDirection="column" gap="md">
      <Stack>
        <Heading as="h5">Signees ({signees.length})</Heading>
        <Stack flex={1} />
        <Heading as="h6">Max {env.MAXSIGNERS}</Heading>
      </Stack>

      <ul
        className={classNames(
          wrapperClass,
          isMultiple ? multipleWrapperClass : '',
        )}
      >
        <Signee signee={initiator} isMultiple={isMultiple} />
        {restSignees.map((signee) => (
          <Signee
            key={signee.accountName}
            signee={signee}
            isMultiple={isMultiple}
          />
        ))}
      </ul>
    </Stack>
  );
};
