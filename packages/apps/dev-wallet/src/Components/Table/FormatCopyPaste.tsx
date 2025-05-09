import { MonoCopyAll } from '@kadena/kode-icons/system';
import { Button } from '@kadena/kode-ui';
import { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

type IProps = Exclude<ICompactTableFormatterProps, 'value'> & {
  value: string;
};

export const FormatCopyPaste: () => FC<IProps> =
  () =>
  ({ value }) => (
    <Button
      isCompact
      variant="outlined"
      onPress={() => {
        navigator.clipboard.writeText(value);
      }}
      endVisual={<MonoCopyAll />}
    />
  );
