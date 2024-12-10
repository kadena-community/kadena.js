import { getAgentRoles } from '@/services/getAgentRoles';
import { useEffect, useState } from 'react';
import { useAccount } from './account';

export const useGetAgentRoles = ({ agent }: { agent?: string }) => {
  const { account } = useAccount();
  const [innerData, setInnerData] = useState<string[]>([]);

  const initInnerData = async (agentArg: string) => {
    const data = await getAgentRoles({ agent: agentArg }, account!);
    setInnerData(data);
  };

  useEffect(() => {
    if (!agent) {
      setInnerData([]);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData(agent);
  }, [agent]);

  return { data: innerData };
};
