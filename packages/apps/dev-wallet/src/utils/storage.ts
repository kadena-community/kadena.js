import { IKeySource, IProfile } from '@/modules/wallet/wallet.repository.ts';
import { IAccount } from '../modules/account/account.repository';

export const getLocalData = (
  item: string = 'profile' || 'keySources' || 'accounts',
) => {
  return localStorage.getItem(item)
    ? JSON.parse(localStorage.getItem(item) || '{}')
    : null;
};

interface LocalData {
  profile?: IProfile;
  keySources?: IKeySource[];
  accounts?: IAccount[];
}

export const setLocalData = ({
  profile,
  keySources,
  accounts,
}: LocalData): void => {
  profile && localStorage.setItem('profile', JSON.stringify(profile));
  keySources && localStorage.setItem('keySources', JSON.stringify(keySources));
  accounts && localStorage.setItem('accounts', JSON.stringify(accounts));
  window.dispatchEvent(new Event('storage'));
};

export const removeLocalData = (): void => {
  localStorage.removeItem('profile');
  localStorage.removeItem('keySources');
  localStorage.removeItem('accounts');
  window.dispatchEvent(new Event('storage'));
};
