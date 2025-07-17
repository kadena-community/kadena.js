import type { INetwork } from '@/constants/network';
import { MonoAdd } from '@kadena/kode-icons/system';
import { Button, Stack, TextField } from '@kadena/kode-ui';
import type { ForwardedRef } from 'react';
import React from 'react';

interface IProps {
  headers: INetwork['headers'];
}

export const BaseHeaders = (
  { headers }: IProps,
  ref: ForwardedRef<HTMLElement>,
) => {
  return (
    <Stack gap="md" ref={ref}>
      <TextField name="key" placeholder="key" aria-label="new key" />
      <TextField name="value" placeholder="key" aria-label="new key" />
      <Button variant="outlined" startVisual={<MonoAdd />} />
    </Stack>
  );
};

export const Headers = React.forwardRef(BaseHeaders);
