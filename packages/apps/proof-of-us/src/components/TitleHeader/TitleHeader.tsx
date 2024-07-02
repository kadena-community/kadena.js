import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import { titleClass } from './style.css';

interface IProps {
  label: string;
  Prepend?: React.ElementType;
  Append?: React.ElementType;
}

export const TitleHeader: FC<IProps> = ({ label, Prepend, Append }) => {
  return (
    <Stack
      display="flex"
      alignItems="center"
      gap="md"
      paddingBlockStart="xl"
      paddingBlockEnd="md"
      width="100%"
      style={{ zIndex: 101 }}
    >
      {Prepend && <Prepend />}
      <h2 className={titleClass}>{label}</h2>
      <Stack flex={1} />
      {Append && <Append />}
    </Stack>
  );
};
