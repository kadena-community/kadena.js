import { useProofOfUs } from '@/hooks/proofOfUs';
import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { Heading } from '../Typography/Heading';
import { Signee } from './Signee';
import { multipleWrapperClass, wrapperClass } from './style.css';

export const ListSignees: FC = () => {
  const { signees } = useProofOfUs();

  const initiator = signees.find((s) => s.initiator);
  const restSignees = signees.filter((s) => !s.initiator) ?? [];

  const isMultiple = signees.length > 2;
  return (
    <Stack flexDirection="column" gap="md">
      <Heading as="h5">Signees ({signees.length})</Heading>

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
