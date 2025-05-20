import type { IUserContext } from '@/contexts/UserContext/UserContext';
import { UserContext } from '@/contexts/UserContext/UserContext';
import { useContext } from 'react';

export const useUser = (): IUserContext => useContext(UserContext);
