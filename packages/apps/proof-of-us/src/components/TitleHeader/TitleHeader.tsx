import { Stack } from '@kadena/react-ui';
import type { FC } from 'react';
import { spacerClass, titleClass } from './style.css';

interface IProps {
  label: string;
  Prepend?: React.ElementType;
  Append?: React.ElementType;
}

export const TitleHeader: FC<IProps> = ({ label, Prepend, Append }) => {
  return (
    <Stack
      flex={1}
      display="flex"
      alignItems="center"
      gap="md"
      paddingBlock="sm"
      paddingInlineEnd="md"
    >
      {Prepend && <Prepend />}
      <h2 className={titleClass}>{label}</h2>
      <span className={spacerClass} />
      {Append && <Append />}
    </Stack>
  );
};
