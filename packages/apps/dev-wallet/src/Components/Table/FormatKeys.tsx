import { MonoKey, MonoSearch } from '@kadena/kode-icons/system';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogHeaderSubtitle,
  Stack,
  Text,
} from '@kadena/kode-ui';
import {
  CompactTable,
  ICompactTableFormatterProps,
} from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { heightDialogClass } from './styles.css';

const RenderContent = ({
  keyset,
  value,
}: {
  keyset: string[];
  value: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <Dialog
          size="md"
          isOpen
          onOpenChange={() => setIsOpen(false)}
          className={heightDialogClass}
        >
          <DialogHeader>Keys</DialogHeader>
          <DialogHeaderSubtitle>{value}</DialogHeaderSubtitle>
          <DialogContent>
            <CompactTable
              variant="open"
              fields={[
                {
                  label: 'Key',
                  key: 'key',
                  variant: 'code',
                  width: '100%',
                },
              ]}
              data={keyset.map((key) => ({ key }))}
            />
          </DialogContent>
        </Dialog>
      )}
      <Stack gap={'sm'} alignItems={'center'}>
        {value}:
        <Stack flexDirection="row" width="100%" gap={'sm'} alignItems="center">
          <MonoKey />
          <Text variant="code"> {keyset.length} keys</Text>
          <Button
            isCompact
            variant="outlined"
            startVisual={<MonoSearch />}
            onClick={() => setIsOpen(true)}
          />
        </Stack>
      </Stack>
    </>
  );
};

export const FormatKeys =
  () =>
  ({ value }: ICompactTableFormatterProps) => {
    if (typeof value === 'string') return null;
    const keyset: string[] =
      value.length > 1 ? (value[1] as unknown as string[]) : [];

    return <RenderContent keyset={keyset} value={value[0]} />;
  };
