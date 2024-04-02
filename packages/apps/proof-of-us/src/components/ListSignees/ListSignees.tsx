import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { SwipeableList, Type } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { Heading } from '../Typography/Heading';
import { Signee } from './Signee';
import { multipleWrapperClass, wrapperClass } from './style.css';

export const ListSignees: FC = () => {
  const { signees, isInitiator, removeSignee } = useProofOfUs();
  const [accountIsInitiator, setAccountIsInitiator] = useState(false);

  const checkInitiator = async () => {
    const initiator = await isInitiator();
    setAccountIsInitiator(initiator);
  };

  useEffect(() => {
    checkInitiator();
  }, [isInitiator]);

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

      <SwipeableList
        threshold={0.5}
        type={Type.IOS}
        fullSwipe={false}
        className={classNames(
          wrapperClass,
          isMultiple ? multipleWrapperClass : '',
        )}
      >
        <Signee
          signee={initiator}
          isMultiple={isMultiple}
          handleRemove={removeSignee}
          canBeRemoved={false}
        />
        {restSignees.map((signee) => (
          <Signee
            canBeRemoved={accountIsInitiator}
            handleRemove={removeSignee}
            key={signee.accountName}
            signee={signee}
            isMultiple={isMultiple}
          />
        ))}
      </SwipeableList>
    </Stack>
  );
};
