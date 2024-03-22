import { useProofOfUs } from '@/hooks/proofOfUs';
import type { FC } from 'react';
import { Heading } from '../Typography/Heading';

import { Stack } from '@kadena/react-ui';
import { Signee } from './Signee';
import { wrapperClass } from './style.css';

export const ListSignees: FC = () => {
  const { signees } = useProofOfUs();

  console.log(signees);

  const initiator = signees.find((s) => s.initiator);
  const restSignees = signees.filter((s) => !s.initiator) ?? [];

  return (
    <Stack flexDirection="column" gap="md">
      <Heading as="h5">Signees ({signees.length})</Heading>

      <ul className={wrapperClass}>
        <Signee signee={initiator} />
        {restSignees.map((signee) => (
          <Signee key={signee.accountName} signee={signee} />
        ))}
      </ul>
    </Stack>
  );
};
