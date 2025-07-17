import type { INetwork } from '@/constants/network';
import { MonoAdd, MonoDelete } from '@kadena/kode-icons/system';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import type { ForwardedRef } from 'react';
import React, { useEffect } from 'react';

interface IProps {
  headers: INetwork['headers'];
}

export const BaseHeaders = (
  { headers }: IProps,
  ref: ForwardedRef<HTMLElement>,
) => {
  const [innerHeaders, setInnerHeaders] =
    React.useState<INetwork['headers']>(headers);

  const handleRemoveHeader = (key: string) => {
    setInnerHeaders((prev) => {
      const newHeaders = { ...prev };
      delete newHeaders[key];
      return newHeaders;
    });
  };

  useEffect(() => {
    setInnerHeaders(headers);
  }, [headers]);

  const handleAddHeader = () => {
    const newKey = (
      document.querySelector('#new input[name="key"]') as HTMLInputElement
    ).value.trim();
    const newValue = (
      document.querySelector('#new input[name="value"]') as HTMLInputElement
    ).value.trim();
    if (newKey && newValue) {
      setInnerHeaders((prev) => ({ ...prev, [newKey]: newValue }));
    }
  };

  useEffect(() => {
    (
      document.querySelector('#new input[name="key"]') as HTMLInputElement
    ).value = '';
    (
      document.querySelector('#new input[name="value"]') as HTMLInputElement
    ).value = '';
  }, [innerHeaders]);

  return (
    <Stack flexDirection="column" gap="md" ref={ref}>
      {Object.entries(innerHeaders ?? {}).map(([key, value]) => (
        <Stack gap="md" key={key}>
          <TextField
            name="key"
            placeholder="key"
            aria-label="key"
            defaultValue={key}
          />
          <TextField
            name="value"
            placeholder="key"
            aria-label="key"
            defaultValue={value}
          />
          <Button
            onPress={() => handleRemoveHeader(key)}
            variant="outlined"
            startVisual={<MonoDelete />}
          />
        </Stack>
      ))}
      <Stack id="new" gap="md">
        <TextField name="key" placeholder="key" aria-label="new key" />
        <TextField name="value" placeholder="value" aria-label="new key" />
        <Button
          onPress={handleAddHeader}
          variant="outlined"
          startVisual={<MonoAdd />}
        />
      </Stack>
    </Stack>
  );
};

export const Headers = React.forwardRef(BaseHeaders);
