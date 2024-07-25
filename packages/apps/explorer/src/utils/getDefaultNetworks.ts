import type { INetwork } from '@/constants/network';
import { networkConstants } from './../constants/network';

export const getDefaultNetworks = (): INetwork[] => networkConstants;
