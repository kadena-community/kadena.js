import { useRouter } from '@/hooks/router';
import {
  Badge,
  Button,
  Form,
  Heading,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import type { FC, FormEventHandler, MouseEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NumberInput } from './components/NumberInput';
import type { IErrors, IValues } from './utils/validation';
import { validate } from './utils/validation';

interface IProps {
  onSubmit: (values: Record<string, string | undefined>) => void;
}

export const EventFilter: FC<IProps> = ({ onSubmit }) => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<IErrors>({});
  const [values, setValues] = useState<IValues>({});

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

  const handleChange = (target?: HTMLInputElement) => {
    if (!formRef.current) return;

    if (!target) return;

    setValues((v) => ({
      ...v,
      [target.name]: target.value,
    }));

    const data = new FormData(formRef.current);

    const chains = data.get('chains')?.toString().trim();
    const minHeight = data.get('minHeight')?.toString().trim();
    const maxHeight = data.get('maxHeight')?.toString().trim();

    // validation
    setErrors((errors) =>
      validate(errors, {
        chains,
        minHeight,
        maxHeight,
      }),
    );
  };

  useEffect(() => {
    const innerValues = {
      chains: router.query.chains as string,
      minHeight: router.query.minHeight as string,
      maxHeight: router.query.maxHeight as string,
    };
    const startingErrors = validate({}, innerValues);
    setValues(innerValues);

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
            variant={errors.chains ? 'negative' : 'default'}
            onChange={(e) => handleChange(e.target)}
            errorMessage={errors.chains}
          ></TextField>
          <NumberInput
            value={values.minHeight}
            name="minHeight"
            label="Block Height min."
            placeholder="123456"
            onChange={handleChange}
            error={errors.minHeight}
          />
          <NumberInput
            value={values.maxHeight}
            name="maxHeight"
            label="Block Height max."
            placeholder="123456"
            onChange={handleChange}
            error={errors.maxHeight}
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
