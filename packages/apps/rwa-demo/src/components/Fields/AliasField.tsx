import { TextField } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface IProps {
  error?: FieldErrors['accountName'];
  alias?: string;
  control: Control<any, any>;
}

export const AliasField: FC<IProps> = ({ error, alias, control }) => {
  return (
    <Controller
      name="alias"
      control={control}
      rules={{
        maxLength: {
          value: 40,
          message: 'This exceeds the maximum length',
        },
        pattern: {
          value: /^[a-zA-Z0-9_-]+$/,
          message: 'Only use allowed characters (a-z A-Z 0-9)',
        },
      }}
      render={({ field }) => (
        <TextField
          id="alias"
          isInvalid={!!error?.message}
          errorMessage={`${error?.message}`}
          label="Alias"
          {...field}
        />
      )}
    />
  );
};
