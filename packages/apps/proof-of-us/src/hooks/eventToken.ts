import { DEVWORLD_TOKENID } from '@/constants';
import { getToken } from '@/utils/marmalade';
import { useState } from 'react';
import type { PactValue } from '../../../../libs/types/dist/types';

export const useEventToken = () => {
  const [token, setToken] = useState<PactValue | null>();

  const retrieveToken = async () => {
    const result = await getToken(DEVWORLD_TOKENID);
    setToken(result);
  };

  return { retrieveToken, token };
};
