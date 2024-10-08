export {
  kadenaCheckMnemonic,
  kadenaGenMnemonic,
  kadenaVerify,
  kadenaChangePassword as legacyKadenaChangePassword,
  kadenaGenKeypair as legacyKadenaGenKeypair,
} from './kadena-crypto.js';

export {
  kadenaChangePassword,
  kadenaGenKeypair,
  kadenaGetPublic,
  kadenaGetPublicFromRootKey,
  kadenaMnemonicToRootKeypair,
  kadenaSign,
  kadenaSignFromRootKey,
} from './compatibility/index.js';
