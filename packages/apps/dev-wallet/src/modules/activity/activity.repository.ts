import { IReceiverAccount } from '@/pages/transfer-v2/utils';
import { ChainId } from '@kadena/client';
import { dbService, IDBService } from '../db/db.service';
import { UUID } from '../types';

export interface TransferData {
  accountId: string;
  chain: ChainId | '';
  receivers: Array<{
    amount: string;
    address: string;
    chain: ChainId | '';
    discoveredAccounts: IReceiverAccount[];
    discoveryStatus: 'not-started' | 'in-progress' | 'done';
    transferMax?: boolean;
  }>;
  gasPayer: string;
  gasPrice: string;
  gasLimit: string;
  type: 'safeTransfer' | 'normalTransfer';
  ttl: string;
}

export interface IActivity {
  uuid: string;
  profileId: string;
  networkUUID: UUID;
  keysetId: string;
  type: 'Transfer';
  status: 'Initiated' | 'InProgress' | 'Success' | 'Failure';
  data: {
    transferData: TransferData;
    txGroups: {
      transfer: {
        groupId: string;
      };
      redistribution: {
        groupId: string;
      };
    };
  };
}

const createActivityRepository = ({
  getOne,
  add,
  update,
  getAll,
}: IDBService) => {
  return {
    getActivity: async (id: string): Promise<IActivity> => {
      return getOne('activity', id);
    },
    getAllActivities: async (
      profileId: string,
      networkUUID: UUID,
    ): Promise<IActivity[]> => {
      return getAll(
        'activity',
        IDBKeyRange.only([profileId, networkUUID]),
        'profile-network',
      );
    },
    getKeysetActivities: async (
      keysetId: string,
      networkUUID: UUID,
    ): Promise<IActivity[]> => {
      return getAll(
        'activity',
        IDBKeyRange.only([keysetId, networkUUID]),
        'keyset-network',
      );
    },
    addActivity: async (activity: IActivity): Promise<void> => {
      return add('activity', activity);
    },
    updateActivity: async (activity: IActivity): Promise<void> => {
      return update('activity', activity);
    },
  };
};

export const activityRepository = createActivityRepository(dbService);
