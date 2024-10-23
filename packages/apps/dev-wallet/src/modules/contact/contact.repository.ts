import { BuiltInPredicate } from '@kadena/client';
import { dbService, IDBService } from '../db/db.service';
import { UUID } from '../types';

export interface IContact {
  uuid: UUID;
  name: string;
  email?: string;
  account: {
    networkUUID: UUID;
    address: string;
    contract: string;
    keyset?: {
      keys: string[];
      pred: BuiltInPredicate;
    };
  };
}

const createContactRepository = ({
  getAll,
  getOne,
  add,
  update,
  remove,
}: IDBService) => {
  return {
    addContact: async (contact: IContact): Promise<void> => {
      return add('contact', contact);
    },
    updateContact: async (contact: IContact): Promise<void> => {
      await update('contact', contact);
    },
    deleteContact: async (uuid: UUID): Promise<void> => {
      await remove('contact', uuid);
    },
    getContactsList: async (): Promise<IContact[]> => {
      return getAll('contact');
    },
    getContact: async (uuid: UUID): Promise<IContact> => {
      return getOne('contact', uuid);
    },
  };
};
export const contactRepository = createContactRepository(dbService);
