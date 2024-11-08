import {
  IAccount,
  IWatchedAccount,
} from '@/modules/account/account.repository';
import { IKeySource, IProfile } from '@/modules/wallet/wallet.repository';
import { recoverPublicKey, retrieveCredential } from '@/utils/webAuthn';

export type IProfilePicked = Pick<
  IProfile,
  'name' | 'uuid' | 'accentColor' | 'options'
>;

type IUnlockType = (
  uuid: string,
  key: string,
) => Promise<{
  profile: IProfile;
  accounts: Array<IAccount>;
  watchedAccounts: Array<IWatchedAccount>;
  keySources: IKeySource[];
} | null>;

export const unlockWithWebAuthn = async (
  profile: IProfilePicked,
  unlockProfile: IUnlockType,
) => {
  if (profile.options.authMode !== 'WEB_AUTHN') {
    throw new Error('Profile does not support WebAuthn');
  }
  const credentialId = profile.options.webAuthnCredential;
  const credential = await retrieveCredential(credentialId);
  if (!credential) {
    throw new Error('Failed to retrieve credential');
  }
  const keys = await recoverPublicKey(credential);
  for (const key of keys) {
    const result = await unlockProfile(profile.uuid, key);
    if (result) {
      return;
    }
  }
  console.error('Failed to unlock profile');
};
