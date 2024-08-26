import {
  Badge,
  Button,
  Form,
  Heading,
  Stack,
  TextField,
} from '@kadena/kode-ui';
import type { FC, FormEventHandler, MouseEventHandler } from 'react';
import React, { useRef, useState } from 'react';
import { NumberInput } from './components/NumberInput';

interface IProps {
  onSubmit: (values: Record<string, string | undefined>) => void;
}

export const EventFilter: FC<IProps> = ({ onSubmit }) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, string | undefined>>({});

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleChange: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const chains = data.get('chains')?.toString().trim();
    const minHeight = data.get('minHeight')?.toString().trim();
    const maxHeight = data.get('maxHeight')?.toString().trim();

    setValues({
      chains,
      minHeight,
      maxHeight,
    });

    // validation
    const chainRegExp = new RegExp(/^\d+(?:\s*,\s*\d+)*\s*,?$/);
    if (chains?.length && !chains?.match(chainRegExp)) {
      setErrors((v) => ({
        ...v,
        chains: 'Only numbers or a comma separated string of numbers',
      }));
    } else {
      setErrors((v) => {
        const newValue = { ...v };
        delete newValue.chains;
        return newValue;
      });
    }

    const minHeightInt = minHeight && parseInt(minHeight);
    const maxHeightInt = maxHeight && parseInt(maxHeight);

    if (
      minHeight &&
      (Number.isNaN(minHeightInt) || (minHeightInt && minHeightInt < 0))
    ) {
      setErrors((v) => ({
        ...v,
        minHeight: 'Only numbers',
      }));
    } else {
      setErrors((v) => {
        const newValue = { ...v };
        delete newValue.minHeight;
        return newValue;
      });
    }

    if (maxHeight && minHeight && minHeight > maxHeight) {
      setErrors((v) => ({
        ...v,
        maxHeight: 'Height min. can not be larger than the Height max',
      }));
    } else if (
      maxHeight &&
      (Number.isNaN(maxHeightInt) || (maxHeightInt && maxHeightInt < 0))
    ) {
      setErrors((v) => ({
        ...v,
        maxHeight: 'Only numbers',
      }));
    } else {
      setErrors((v) => {
        const newValue = { ...v };
        delete newValue.maxHeight;
        return newValue;
      });
    }
  };

  const handleReset: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!formRef.current) return;
    formRef.current.reset();
    setErrors({});
    setValues({});
  };

  const activeFilterCount = Object.entries(values).filter((v) => {
    return v[1];
  });
  return (
    <>
      <Heading as="h5">Filters</Heading>
      <Form ref={formRef} onSubmit={handleSubmit} onChange={handleChange}>
        <Stack flexDirection="column" gap="xl">
          <TextField
            name="chains"
            label="Chains"
            placeholder="1, 2, 3, ..."
            variant={errors.chains ? 'negative' : 'default'}
            errorMessage={errors.chains}
          ></TextField>
          <NumberInput
            name="minHeight"
            label="Block Height min."
            placeholder="123456"
            error={errors.minHeight}
          />
          <NumberInput
            name="maxHeight"
            label="Block Height max."
            placeholder="123456"
            error={errors.maxHeight}
          />

          <Stack width="100%" justifyContent="space-between">
            <Button onClick={handleReset} isCompact variant="outlined">
              Reset
            </Button>
            <Button
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
