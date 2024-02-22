import { useProofOfUs } from '@/hooks/proofOfUs';
import type { FC } from 'react';
import { Heading } from '../Typography/Heading';

import { Stack } from '@kadena/react-ui';
import { Signee } from './Signee';
import { wrapperClass } from './style.css';

export const ListSignees: FC = () => {
  const { proofOfUs } = useProofOfUs();

  const initiator = proofOfUs?.signees?.find((s) => s.initiator);
  const signee = proofOfUs?.signees?.find((s) => !s.initiator);

  console.log(proofOfUs?.signees);
  return (
    <Stack flexDirection="column" gap="md">
      <Heading as="h6">Signees</Heading>
      <section className={wrapperClass}>
        <Signee signee={initiator} />
        <Signee signee={signee} />
      </section>
    </Stack>
  );
};
