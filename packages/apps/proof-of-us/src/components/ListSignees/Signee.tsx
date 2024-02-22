import { useAccount } from '@/hooks/account';
import { deviceColors } from '@/styles/tokens.css';
import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { SignStatus } from '../SignStatus/SignStatus';
import { Text } from '../Typography/Text';
import { accountClass, ellipsClass, nameClass, signeeClass } from './style.css';

interface IProps {
  signee?: IProofOfUsSignee;
}

const isMe = (signer?: IProofOfUsSignee, account?: IAccount) => {
  if (!signer || !account) return false;
  return signer.accountName === account?.accountName;
};

const getName = (signee?: IProofOfUsSignee): string => {
  if (!signee) return 'Pending';
  return signee.name ? signee.name : signee.alias;
};

const getAccount = (signee?: IProofOfUsSignee): string => {
  if (!signee) return 'N/A';
  return signee.accountName;
};

export const Signee: FC<IProps> = ({ signee }) => {
  const { account } = useAccount();

  const getSuccessStyle = (signee?: IProofOfUsSignee) => {
    if (signee?.signerStatus === 'success') {
      return {
        borderColor: deviceColors.darkGreen,
      };
    }
    return {};
  };
  return (
    <Stack
      className={signeeClass}
      flexDirection="column"
      alignItems="center"
      gap="sm"
      style={getSuccessStyle(signee)}
    >
      <SignStatus status={signee?.signerStatus} />
      <Text className={classNames(nameClass, ellipsClass)} bold>
        {getName(signee)} {isMe(signee, account) && ' (me)'}
      </Text>
      <Text className={classNames(accountClass, ellipsClass)}>
        {getAccount(signee)}
      </Text>
    </Stack>
  );
};
