import { useGetAgents } from '@/hooks/getAgents';
import { CompactTable } from '@kadena/kode-ui/patterns';
import type { FC } from 'react';

export const AgentsList: FC = () => {
  const { data } = useGetAgents();

  console.log(data);

  return (
    <CompactTable
      fields={[
        { label: 'Account', key: 'accountName', width: '50%' },
        { label: 'Requestkey', key: 'requestKey', width: '50%' },
      ]}
      data={data}
    />
  );
};
