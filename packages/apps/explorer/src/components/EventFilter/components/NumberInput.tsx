import { MonoAdd, MonoRemove } from '@kadena/kode-icons/system';
import { Button, TextField } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useRef } from 'react';

interface IProps {
  name: string;
  label: string;
  placeholder: string;
  error: string;
  value?: string;
  onChange: (target: HTMLInputElement) => void;
}

export const NumberInput: FC<IProps> = ({
  name,
  label,
  placeholder,
  error,
  value,
  onChange,
  ...props
}) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleDown = () => {
    if (!ref.current || !ref.current.value) return;
    ref.current.value = `${parseInt(ref.current.value ?? '0') - 1}`;
    onChange(ref.current);
  };
  const handleUp = () => {
    if (!ref.current || !ref.current.value) return;
    ref.current.value = `${parseInt(ref.current.value ?? '0') + 1}`;
    onChange(ref.current);
  };

  return (
    <TextField
      value={value}
      ref={ref}
      name={name}
      label={label}
      onChange={(e) => onChange(e.target)}
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
