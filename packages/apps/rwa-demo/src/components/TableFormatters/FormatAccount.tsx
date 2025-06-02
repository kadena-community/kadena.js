import { useUser } from '@/hooks/user';
import { maskValue, Stack, Text } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';

export interface IActionProps {}

export const FormatAccount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const { findAliasByAddress } = useUser();

    const displayName = findAliasByAddress(`${value}`);
    return (
      <Stack flexDirection="column" gap="xs">
        <Text variant="code">{maskValue(`${value}`)}</Text>
        <Text size="smallest">{displayName}</Text>
      </Stack>
    );
  };
  return Component;
};
