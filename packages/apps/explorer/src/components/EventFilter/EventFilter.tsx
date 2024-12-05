import { useRouter } from '@/hooks/router';
import {
  Badge,
  Button,
  Form,
  Heading,
  NumberField,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import type { FC, FormEventHandler, MouseEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { IErrors, IValues } from './utils/validation';
import {
  validateChains,
  validateHeight,
  validateMinLesserThanMax,
} from './utils/validation';

interface IProps {
  onSubmit: (values: Record<string, string | undefined>) => void;
}

export const EventFilter: FC<IProps> = ({ onSubmit }) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<IErrors>({});
  const [values, setValues] = useState<IValues>({});

  const validate = (errors: IErrors, values: IValues): IErrors => {
    let newErrors = validateChains(values.chains, errors);
    newErrors = validateHeight('maxHeight', values.maxHeight, newErrors);
    newErrors = validateHeight('minHeight', values.minHeight, newErrors);
    newErrors = validateMinLesserThanMax(
      'minHeight',
      values.minHeight,
      values.maxHeight,
      newErrors,
    );

    return newErrors;
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const queryString = Object.entries(values).reduce((acc, val) => {
      if (!val[1]) return acc;

      return `${acc}&${val[0]}=${val[1]}`;
    }, '');

    const route = router.asPath.split('?');

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.push(`${route[0]}?${queryString}`);
  };

  const handleChange = (value: string | number, name: string) => {
    if (!formRef.current) return;

    const innerValues = { ...values, [name]: `${value}` };
    setValues(innerValues);

    // validation
    setErrors((errors) => validate(errors, innerValues));
  };

  useEffect(() => {
    const innerValues = {
      chains: router.query.chains as string,
      minHeight: router.query.minHeight as string,
      maxHeight: router.query.maxHeight as string,
    };
    setValues(innerValues);

    const startingErrors = validate({}, innerValues);
    if (!Object.keys(startingErrors).length) {
      onSubmit(innerValues);
    }
  }, [router.asPath]);

  useEffect(() => {
    if (Object.keys(values).length === 0) {
      formRef.current?.reset();
    }
  }, [values]);

  const handleReset: MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!formRef.current) return;
      formRef.current.reset();

      setErrors({});
      setValues({});

      const route = router.asPath.split('?');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push(`${route[0]}`);
    },
    [router.asPath],
  );

  const activeFilterCount = Object.entries(values).filter((v) => {
    return v[1];
  });

  return (
    <>
      <Heading as="h5">Filters</Heading>
      <Form validationErrors={errors} ref={formRef} onSubmit={handleFormSubmit}>
        <Stack flexDirection="column" gap="xl">
          <TextField
            value={values.chains}
            name="chains"
            label="Chains"
            placeholder="1, 2, 3, ..."
            onValueChange={(v) => handleChange(v, 'chains')}
            variant={errors.chains ? 'negative' : 'default'}
            errorMessage={errors.chains}
          ></TextField>
          <NumberField
            value={parseInt(values.minHeight ?? '')}
            key="minHeight"
            label="Block Height min."
            placeholder="123456"
            onValueChange={(v) => handleChange(v, 'minHeight')}
            variant={errors.minHeight ? 'negative' : 'default'}
            errorMessage={errors.minHeight}
          />
          <NumberField
            value={parseInt(values.maxHeight ?? '')}
            key="maxHeight"
            label="Block Height max."
            placeholder="123456"
            onValueChange={(v) => handleChange(v, 'maxHeight')}
            variant={errors.maxHeight ? 'negative' : 'default'}
            errorMessage={errors.maxHeight}
          />

          <Stack width="100%" justifyContent="space-between">
            <Button onClick={handleReset} isCompact variant="outlined">
              Reset
            </Button>

            <Button
              isDisabled={!!Object.keys(errors).length}
              type="submit"
              isCompact
              variant="primary"
              endVisual={
                activeFilterCount.length > 0 ? (
                  <Badge size="sm" style="inverse">
                    {activeFilterCount.length}
                  </Badge>
                ) : undefined
              }
            >
              Apply
            </Button>
          </Stack>
        </Stack>
      </Form>
    </>
  );
};
