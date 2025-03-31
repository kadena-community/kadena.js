import { TextField } from '@kadena/kode-ui';
import type { FC } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface IProps {
  error?: FieldErrors['accountName'];
  accountName?: string;
  control: Control<any, any>;
}

export const AccountNameField: FC<IProps> = ({
  error,
  accountName,
  control,
}) => {
  return (
    <Controller
      name="accountName"
      control={control}
      rules={{
        required: true,
        maxLength: {
          value: 70,
          message: 'This exceeds the maximum length',
        },
        pattern: {
          value: /^[a-z]:[a-zA-Z0-9_.]+$/,
          message: 'Fill in a correct ..:account',
        },
      }}
      render={({ field }) => (
        <TextField
          placeholder="k:1234..."
          id="accountName"
          isInvalid={!!error?.message}
          errorMessage={`${error?.message}`}
          isDisabled={!!accountName}
          label="AccountName"
          {...field}
        />
      )}
    />
  );
};
