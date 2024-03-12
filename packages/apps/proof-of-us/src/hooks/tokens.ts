import { TokenContext } from '@/components/TokenProvider/TokenProvider';
import { useContext } from 'react';

export const useTokens = () => useContext(TokenContext);
