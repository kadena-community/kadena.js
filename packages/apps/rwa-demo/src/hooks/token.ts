import type { ITokenContext } from '@/components/TokenProvider/TokenProvider';
import { TokenContext } from '@/components/TokenProvider/TokenProvider';

import { useContext } from 'react';

export const useToken = (): ITokenContext => useContext(TokenContext);
