import { MonoAdd, MonoRemove } from '@kadena/kode-icons/system';
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
    const heightMin = data.get('heightMin')?.toString().trim();
    const heightMax = data.get('heightMax')?.toString().trim();

    setValues({
      chains,
      heightMin,
      heightMax,
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

    const heightMinInt = heightMin && parseInt(heightMin);
    if (heightMin && Number.isNaN(heightMinInt)) {
      setErrors((v) => ({
        ...v,
        heightMin: 'Only numbers',
      }));
    } else {
      setErrors((v) => {
        const newValue = { ...v };
        delete newValue.heightMin;
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
          <TextField
            name="heightMin"
            label="Block Height min."
            placeholder="123456"
            variant={errors.heightMin ? 'negative' : 'default'}
            errorMessage={errors.heightMin}
            endAddon={
              <>
                <Button
                  isCompact
                  variant="transparent"
                  onPress={() => alert('Copied!')}
                >
                  <MonoAdd />
                </Button>
                <Button
                  isCompact
                  variant="transparent"
                  onPress={() => alert('Copied!')}
                >
                  <MonoRemove />
                </Button>
              </>
            }
          />
          <TextField
            name="heightMax"
            label="Block Height max."
            placeholder="123456"
            variant={errors.heightMax ? 'negative' : 'default'}
            errorMessage={errors.heightMax}
            endAddon={
              <>
                <Button
                  isCompact
                  variant="transparent"
                  onPress={() => alert('Copied!')}
                >
                  <MonoAdd />
                </Button>
                <Button
                  isCompact
                  variant="transparent"
                  onPress={() => alert('Copied!')}
                >
                  <MonoRemove />
                </Button>
              </>
            }
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
