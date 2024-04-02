import { useAccount } from '@/hooks/account';
import { deviceColors } from '@/styles/tokens.css';
import { getSigneeName } from '@/utils/getSigneeName';
import classNames from 'classnames';
import type { FC } from 'react';
import { SignStatus } from '../SignStatus/SignStatus';
import { Text } from '../Typography/Text';
import {
  accountClass,
  ellipsClass,
  multipleSigneeClass,
  nameClass,
  signeeClass,
} from './style.css';

interface IProps {
  signee?: IProofOfUsSignee;
  isMultiple: boolean;
}

const isMe = (signer?: IProofOfUsSignee, account?: IAccount) => {
  if (!signer || !account) return false;
  return signer.accountName === account?.accountName;
};

const getAccount = (signee?: IProofOfUsSignee): string => {
  if (!signee) return 'N/A';
  return signee.accountName;
};

export const Signee: FC<IProps> = ({ signee, isMultiple }) => {
  const { account } = useAccount();

  const getSuccessStyle = (signee?: IProofOfUsSignee) => {
    if (signee?.signerStatus === 'success') {
      return {
        borderColor: deviceColors.green,
      };
    }
    return {};
  };
  return (
    <li
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
    </li>
  );
};
