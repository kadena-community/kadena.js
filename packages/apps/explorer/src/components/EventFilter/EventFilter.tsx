import { MonoAdd, MonoRemove } from '@kadena/kode-icons/system';
import { Button, Form, Heading, Stack, TextField } from '@kadena/kode-ui';
import type { FC, FormEventHandler } from 'react';
import React from 'react';

interface IProps {
  handleSubmit: FormEventHandler<HTMLFormElement>;
}

export const EventFilter: FC<IProps> = ({ handleSubmit }) => {
  return (
    <>
      <Heading as="h5">Filters</Heading>
      <Form onSubmit={handleSubmit}>
        <Stack flexDirection="column" gap="xl">
          <TextField label="Chains" placeholder="1, 2, 3, ..."></TextField>
          <TextField
            label="Block Height min."
            placeholder="123456"
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
            label="Block Height max."
            placeholder="123456"
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
            <Button isCompact variant="outlined">
              Reset
            </Button>
            <Button type="submit" isCompact variant="primary">
              Apply
            </Button>
          </Stack>
        </Stack>
      </Form>
    </>
  );
};
