import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import {
  getAllowedSigners,
  getPercentageSignees,
  isAlreadySigning,
} from '@/utils/isAlreadySigning';
import {
  MonoDelete,
  MonoSignature,
  MonoSignatureNotAllowed,
} from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import {
  LeadingActions,
  SwipeAction,
  SwipeableList,
  SwipeableListItem,
  TrailingActions,
  Type,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { Heading } from '../Typography/Heading';
import { SignedPercentage } from './SignedPercentage';
import { Signee } from './Signee';
import {
  multipleWrapperClass,
  removeClass,
  removeSigningClass,
  wrapperClass,
} from './style.css';

export const ListSignees: FC = () => {
  const { signees, isInitiator, removeSignee, proofOfUs, toggleAllowedToSign } =
    useProofOfUs();
  const [accountIsInitiator, setAccountIsInitiator] = useState(false);

  const checkInitiator = async () => {
    const initiator = await isInitiator();
    setAccountIsInitiator(initiator);
  };

  useEffect(() => {
    checkInitiator();
  }, [isInitiator]);

  const handleRemove = useCallback(
    (signee: IProofOfUsSignee, isInitiator: boolean) => () => {
      if (!signee || !isInitiator) return;

      removeSignee({ signee });
    },
    [],
  );

  const handleToggleAllowedToSign = useCallback(
    (signee: IProofOfUsSignee, isInitiator: boolean) => () => {
      if (!signee || !isInitiator) return;

      toggleAllowedToSign({ signee });
    },
    [],
  );

  if (!signees) return null;

  const initiator = signees.find((s) => s.initiator);
  const restSignees = signees.filter((s) => !s.initiator) ?? [];

  const isMultiple = signees.length > 1;

  return (
    <Stack flexDirection="column" gap="md">
      <Stack gap="sm" alignItems="center">
        <Heading as="h5">Signees ({getAllowedSigners(signees).length})</Heading>

        <Stack flex={1}>
          {isAlreadySigning(proofOfUs) && (
            <motion.div
              key="percentage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SignedPercentage
                signees={signees}
                percentage={getPercentageSignees(signees)}
              />
            </motion.div>
          )}
        </Stack>
        <Heading as="h6">Max {env.MAXSIGNERS}</Heading>
      </Stack>

      <SwipeableList
        fullSwipe={false}
        type={Type.IOS}
        threshold={0.5}
        className={classNames(
          wrapperClass,
          isMultiple ? multipleWrapperClass : '',
        )}
      >
        <Signee
          key={initiator?.accountName}
          signee={initiator}
          isMultiple={isMultiple}
        />
        {restSignees.map((signee) => {
          const trailingActions = () => (
            <TrailingActions>
              <SwipeAction
                destructive={true}
                onClick={handleRemove(signee, accountIsInitiator)}
              >
                <div className={removeClass}>
                  <MonoDelete />
                </div>
              </SwipeAction>
            </TrailingActions>
          );

          const leadingActions = () => (
            <LeadingActions>
              <SwipeAction
                destructive={false}
                onClick={handleToggleAllowedToSign(signee, accountIsInitiator)}
              >
                <div className={removeSigningClass}>
                  {signee.signerStatus === 'notsigning' ? (
                    <MonoSignature />
                  ) : (
                    <MonoSignatureNotAllowed />
                  )}
                </div>
              </SwipeAction>
            </LeadingActions>
          );

          return (
            <SwipeableListItem
              blockSwipe={!accountIsInitiator || isAlreadySigning(proofOfUs)}
              key={signee.accountName}
              trailingActions={trailingActions()}
              leadingActions={leadingActions()}
            >
              <Signee
                key={signee.accountName}
                signee={signee}
                isMultiple={isMultiple}
              />
            </SwipeableListItem>
          );
        })}
      </SwipeableList>
    </Stack>
  );
};
