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
        pattern: {
          value: /^k:[0-9a-fA-F]{64}$/,
          message: 'Fill in a correct K:account',
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
