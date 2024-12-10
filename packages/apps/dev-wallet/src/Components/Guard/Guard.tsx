import { IGuard } from '@/modules/account/account.repository';
import {
  isCapabilityGuard,
  isKeysetGuard,
  isKeysetRefGuard,
  isModuleGuard,
  isPactGuard,
  isUserGuard,
} from '@/modules/account/guards';
import { Stack, Text } from '@kadena/kode-ui';
import { ellipsis } from '@kadena/kode-ui/styles';
import { Keyset } from './keyset';

export function getGuardInfo(guard: IGuard) {
  if (!guard) return { type: '', value: '' };
  if (isKeysetGuard(guard)) {
    return {
      type: 'KeysetGuard',
      value: guard.principal,
    };
  } else if (isKeysetRefGuard(guard)) {
    return {
      type: 'KeysetRefGuard',
      value: guard.principal,
    };
  } else if (isUserGuard(guard)) {
    return {
      type: 'UserGuard',
      value: guard.principal,
    };
  } else if (isModuleGuard(guard)) {
    return {
      type: 'ModuleGuard',
      value: guard.principal,
    };
  } else if (isCapabilityGuard(guard)) {
    return {
      type: 'CapabilityGuard',
      value: guard.principal,
    };
  } else if (isPactGuard(guard)) {
    return {
      type: 'PactGuard',
      value: guard.principal,
    };
  } else {
    return {
      type: 'Guard',
      value: (guard as any).principal,
    };
  }
}

export const Guard = ({ guard }: { guard: IGuard }) => {
  if (!guard) return null;

  if (isKeysetGuard(guard)) {
    return <Keyset guard={guard} />;
  }

  const { type, value } = getGuardInfo(guard);

  return (
    <Stack
      flexWrap="wrap"
      flexDirection={'row'}
      gap="md"
      paddingInline={'sm'}
      marginBlock={'xs'}
    >
      <Text size="smallest" className={ellipsis}>
        {type}
        {value ? `: ${value}` : ''}
      </Text>
    </Stack>
  );
};
