import {
  INetwork,
  networkRepository,
} from '@/modules/network/network.repository';
import { Box, Button, Heading, TextField } from '@kadena/react-ui';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function CreateNetwork() {
  const navigate = useNavigate();
  const { control, register, handleSubmit } = useForm<Omit<INetwork, 'uuid'>>({
    defaultValues: {
      networkId: '',
      hosts: [
        {
          url: '',
          submit: true,
          read: true,
          confirm: true,
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'hosts' });
  async function create(network: Omit<INetwork, 'uuid'>) {
    await networkRepository.addNetwork({
      ...network,
      uuid: crypto.randomUUID(),
    });
    navigate('/networks');
  }

  return (
    <main>
      <Box margin="md">
        <Heading variant="h5">Create network</Heading>
        <form onSubmit={handleSubmit(create)}>
          <label htmlFor="networkId">Network Id</label>
          <TextField
            aria-label="networkId"
            id="networkId"
            type="text"
            {...register('networkId')}
          />
          <Heading variant="h5">Hosts</Heading>
          <Button
            onPress={() =>
              append({
                url: '',
                submit: true,
                read: true,
                confirm: true,
              })
            }
          >
            + host
          </Button>
          {fields.map((field, index) => (
            <div key={field.id}>
              <label htmlFor={`hosts.${index}.url`}>url</label>
              <TextField
                id={`hosts.${index}.url`}
                type="text"
                aria-label="url"
                {...register(`hosts.${index}.url`)}
              />
              <label htmlFor={`hosts.${index}.submit`}>submit</label>
              <input
                type="checkbox"
                id={`hosts.${index}.submit`}
                {...register(`hosts.${index}.submit`)}
              />
              <label htmlFor={`hosts.${index}.read`}>read</label>
              <input
                type="checkbox"
                id={`hosts.${index}.read`}
                {...register(`hosts.${index}.read`)}
              />
              <label htmlFor={`hosts.${index}.confirm`}>confirm</label>
              <input
                type="checkbox"
                id={`hosts.${index}.confirm`}
                {...register(`hosts.${index}.confirm`)}
              />
              <Button onPress={() => remove(index)}>Delete</Button>
            </div>
          ))}
          <Button type="submit">Create</Button>
        </form>
      </Box>
    </main>
  );
}
