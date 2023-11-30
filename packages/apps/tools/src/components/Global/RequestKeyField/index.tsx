import type { ITextFieldProps } from '@kadena/react-ui';
import {FormFieldWrapper, Input } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import type { FieldError } from 'react-hook-form';
import * as z from 'zod';
import { requestKeyWrapperStyle } from "@/components/Global/RequestKeyField/styles.css";

export const RequestLength: { MIN: number; MAX: number } = { MIN: 43, MAX: 44 };

export const REQUEST_KEY_VALIDATION = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (val.length === RequestLength.MAX) {
        return val[val.length - 1] === '=';
      }
      return val.length === RequestLength.MIN;
    },
    {
      message:
        'Your request key is invalid. Please provide a valid request key.',
    },
  );

interface IRequestKeyFieldProps
  extends Partial<Omit<ITextFieldProps, 'inputProps'>> {
  inputProps: Partial<ITextFieldProps['inputProps']>;
  error?: FieldError;
}

const RequestKeyField: FC<IRequestKeyFieldProps> = ({
  error,
  inputProps,
  status,
  helperText,
  ...rest
}) => {
  const { t } = useTranslation('common');

  const helper = helperText || error?.message;

  return (
    <div className={requestKeyWrapperStyle}>
      <FormFieldWrapper
        label={t('Request Key')}
        status={error ? 'negative' : status}
        helperText={helper}
        htmlFor={'request-key-input'}
        {...rest}
      >
        <Input
          {...inputProps}
          placeholder={t('Enter Request Key')}
          id={'request-key-input'}
          icon={'KeyIconFilled'}
        />
      </FormFieldWrapper>
    </div>

  );
};

export default RequestKeyField;
