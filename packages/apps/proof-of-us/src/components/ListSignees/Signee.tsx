import { useAccount } from '@/hooks/account';
import { deviceColors } from '@/styles/tokens.css';
import { getSigneeName } from '@/utils/getSigneeName';
import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { PingStatus } from '../PingStatus/PingStatus';
import { SignStatus } from '../SignStatus/SignStatus';
import { Text } from '../Typography/Text';
import {
  accountClass,
  ellipsClass,
  multipleNameClass,
  multipleSigneeClass,
  nameClass,
  notAllowedToSignClass,
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

  if (!signee) return null;

  const isMeChecked = isMe(signee, account);
  const notAllowedToSign = signee.signerStatus === 'notsigning';
  return (
    <div
      className={classNames(
        isMultiple ? multipleSigneeClass : signeeClass,
        notAllowedToSign && notAllowedToSignClass,
      )}
      style={getSuccessStyle(signee)}
    >
      <Stack gap="sm" alignItems="center">
        <SignStatus status={signee?.signerStatus} />
        <PingStatus signee={signee} />
      </Stack>
      <Text
        className={classNames(
          nameClass,
          ellipsClass,
          isMultiple && multipleNameClass,
        )}
        bold
      >
        {getSigneeName(signee)} {isMeChecked && ' (me)'}
      </Text>
      <Text className={classNames(accountClass, ellipsClass)}>
        {getAccount(signee)}
      </Text>
    </div>
  );
};
