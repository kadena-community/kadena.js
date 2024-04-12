import { useAccount } from '@/hooks/account';
import { deviceColors } from '@/styles/tokens.css';
import { getSigneeName } from '@/utils/getSigneeName';
import { Stack } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import { PingStatus } from '../PingStatus/PingStatus';
import { SignStatus } from '../SignStatus/SignStatus';
import { Tag } from '../Tag/Tag';
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

  const isInitiator = signee.initiator;
  const isMeChecked = isMe(signee, account);
  const notAllowedToSign = signee.signerStatus === 'notsigning';
  return (
    <Stack
      className={classNames(
        isMultiple ? multipleSigneeClass : signeeClass,
        notAllowedToSign && notAllowedToSignClass,
      )}
      style={getSuccessStyle(signee)}
      flexDirection="column"
      justifyContent="flex-start"
      padding={isMultiple ? 'sm' : 'md'}
    >
      <Stack
        gap="md"
        alignItems="center"
        width="100%"
        flexDirection={isMultiple ? 'row' : 'column'}
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
          {getSigneeName(signee)}
        </Text>
        <Text className={classNames(accountClass, ellipsClass)}>
          {getAccount(signee)}
        </Text>
      </Stack>
      <Stack
        paddingBlockStart="sm"
        gap="sm"
        justifyContent={isMultiple ? 'flex-start' : 'center'}
      >
        {isInitiator && <Tag>initiator</Tag>}
        {isMeChecked && <Tag color="green">me</Tag>}
        {notAllowedToSign && <Tag color="red">no need to sign</Tag>}
      </Stack>
    </Stack>
  );
};
