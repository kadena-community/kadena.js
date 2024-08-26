import { MonoAdd, MonoRemove } from '@kadena/kode-icons/system';
import type { PressEvent } from '@kadena/kode-ui';
import { Button, TextField } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useRef } from 'react';

interface IProps {
  name: string;
  label: string;
  placeholder: string;
  error: string;
  value?: string;
}

export const NumberInput: FC<IProps> = ({
  name,
  label,
  placeholder,
  error,

  value,
  ...props
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleDown = (e: PressEvent) => {
    if (!ref.current) return;
    ref.current.value = `${parseInt(ref.current.value ?? '0') - 1}`;
  };
  const handleUp = (e: PressEvent) => {
    if (!ref.current) return;
    ref.current.value = `${parseInt(ref.current.value ?? '0') + 1}`;
  };

  return (
    <TextField
      value={value}
      ref={ref}
      name={name}
      label={label}
      placeholder={placeholder}
      variant={error ? 'negative' : 'default'}
      errorMessage={error}
      {...props}
      endAddon={
        <>
          <Button isCompact variant="transparent" onPress={handleUp}>
            <MonoAdd />
          </Button>
          <Button isCompact variant="transparent" onPress={handleDown}>
            <MonoRemove />
          </Button>
        </>
      }
    />
  );
};
