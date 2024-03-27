import { store } from '@/utils/socket/store';
import { useEffect, useState } from 'react';

export const useLeaderboard = () => {
  const [data, setData] = useState<IAccountLeaderboard[]>([]);

  useEffect(() => {
    store.listenLeaderboard(setData);
  }, []);

  return {
    data,
  };
};
