import { IRetrievedAccount } from '@/modules/account/IRetrievedAccount';
import { ChainId } from '@kadena/client';
import { dbService, IDBService } from '../db/db.service';
import { UUID } from '../types';

export interface TransferData {
  accountId: string;
  senderAccount: IRetrievedAccount;
  chain: ChainId | '';
  receivers: Array<{
    amount: string;
    address: string;
    chain: ChainId | '';
    discoveredAccount: IRetrievedAccount;
    transferMax?: boolean;
  }>;
  gasPayer: IRetrievedAccount;
  gasPrice: string;
  gasLimit: string;
  type: 'safeTransfer' | 'normalTransfer';
  ttl: number;
  creationTime: number;
}

export interface IActivity {
  uuid: string;
  profileId: string;
  networkUUID: UUID;
  account: IRetrievedAccount;
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
    addActivity: async (activity: IActivity): Promise<void> => {
      return add('activity', activity);
    },
    updateActivity: async (activity: IActivity): Promise<void> => {
      return update('activity', activity);
    },
  };
};

export const activityRepository = createActivityRepository(dbService);
