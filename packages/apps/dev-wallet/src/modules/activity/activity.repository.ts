import { dbService, IDBService } from '../db/db.service';

export interface IActivity {
  uuid: string;
  profileId: string;
  networkId: string;
  type: 'Transfer';
  status: 'Initiated' | 'InProgress' | 'Success' | 'Failure';
  initiator: string;
  data: Record<string, unknown>;
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
      networkId: string,
    ): Promise<IActivity[]> => {
      return getAll(
        'activity',
        IDBKeyRange.only([profileId, networkId]),
        'profile-network',
      );
    },
    addActivity: async (keySource: IActivity): Promise<void> => {
      return add('activity', keySource);
    },
    updateActivity: async (keySource: IActivity): Promise<void> => {
      return update('activity', keySource);
    },
  };
};

export const keySourceRepository = createActivityRepository(dbService);
