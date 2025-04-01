import { IProfile } from '@/modules/wallet/wallet.repository';
import { MonoFingerprint, MonoKey } from '@kadena/kode-icons/system';

export const showIcon = (type?: IProfile['options']['authMode']) => {
  switch (type) {
    case 'PASSWORD':
      return <MonoKey />;
    case 'WEB_AUTHN':
      return <MonoFingerprint />;
  }

  return '';
};
