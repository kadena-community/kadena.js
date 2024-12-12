import { AGENTROLES } from '@/services/addAgent';
import { getAgentRoles } from '@/services/getAgentRoles';
import { useCallback, useEffect, useState } from 'react';

export interface IAgentHookProps {
  getAll: () => string[];
  isAgentAdmin: () => boolean;
  isSupplyModifier: () => boolean;
  isFreezer: () => boolean;
  isTransferManager: () => boolean;
  isRecoveryManager: () => boolean;
  isComplianceManager: () => boolean;
  isWhitelistManager: () => boolean;
}

export const useGetAgentRoles = ({
  agent,
}: {
  agent?: string;
}): IAgentHookProps => {
  const [innerData, setInnerData] = useState<string[]>([]);

  const initInnerData = async (agentArg: string) => {
    const data = await getAgentRoles({ agent: agentArg });
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

  const getAll = useCallback(() => {
    return innerData;
  }, [innerData]);

  const isAgentAdmin = useCallback(() => {
    return innerData.indexOf(AGENTROLES.AGENTADMIN) >= 0;
  }, [innerData]);

  const isSupplyModifier = useCallback(() => {
    return innerData.indexOf(AGENTROLES.SUPPLYMODIFIER) >= 0;
  }, [innerData]);

  const isFreezer = useCallback(() => {
    return innerData.indexOf(AGENTROLES.FREEZER) >= 0;
  }, [innerData]);

  const isTransferManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.TRANSFERMANAGER) >= 0;
  }, [innerData]);

  const isRecoveryManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.RECOVERY) >= 0;
  }, [innerData]);

  const isComplianceManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.COMPLIANCE) >= 0;
  }, [innerData]);

  const isWhitelistManager = useCallback(() => {
    return innerData.indexOf(AGENTROLES.WHITELISTMANAGER) >= 0;
  }, [innerData]);

  return {
    getAll,
    isAgentAdmin,
    isSupplyModifier,
    isFreezer,
    isTransferManager,
    isRecoveryManager,
    isComplianceManager,
    isWhitelistManager,
  };
};
