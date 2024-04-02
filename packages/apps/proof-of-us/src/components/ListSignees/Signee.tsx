import { useAccount } from '@/hooks/account';
import { deviceColors } from '@/styles/tokens.css';
import { getSigneeName } from '@/utils/getSigneeName';
import { MonoDelete } from '@kadena/react-icons';
import classNames from 'classnames';
import type { FC } from 'react';
import {
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { SignStatus } from '../SignStatus/SignStatus';
import { Text } from '../Typography/Text';
import {
  accountClass,
  ellipsClass,
  multipleSigneeClass,
  nameClass,
  removeClass,
  signeeClass,
} from './style.css';

interface IProps {
  signee?: IProofOfUsSignee;
  isMultiple: boolean;
  canBeRemoved: boolean;
  handleRemove: ({ signee }: { signee: IProofOfUsSignee }) => Promise<void>;
}

const isMe = (signer?: IProofOfUsSignee, account?: IAccount) => {
  if (!signer || !account) return false;
  return signer.accountName === account?.accountName;
};

const getAccount = (signee?: IProofOfUsSignee): string => {
  if (!signee) return 'N/A';
  return signee.accountName;
};

export const Signee: FC<IProps> = ({
  signee,
  isMultiple,
  canBeRemoved,
  handleRemove,
}) => {
  const { account } = useAccount();

  const getSuccessStyle = (signee?: IProofOfUsSignee) => {
    if (signee?.signerStatus === 'success') {
      return {
        borderColor: deviceColors.green,
      };
    }
    return {};
  };

  const removeSignee = () => {
    console.log('remove s');
    if (!signee) return;
    handleRemove({ signee });
  };

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction destructive={true} onClick={removeSignee}>
        <div className={removeClass}>
          <MonoDelete />
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableListItem
      blockSwipe={!canBeRemoved}
      trailingActions={trailingActions()}
    >
      <div
        className={classNames(isMultiple ? multipleSigneeClass : signeeClass)}
        style={getSuccessStyle(signee)}
      >
        <SignStatus status={signee?.signerStatus} />
        <Text className={classNames(nameClass, ellipsClass)} bold>
          {getSigneeName(signee)} {isMe(signee, account) && ' (me)'}
        </Text>
        <Text className={classNames(accountClass, ellipsClass)}>
          {getAccount(signee)}
        </Text>
      </div>
    </SwipeableListItem>
  );
};
