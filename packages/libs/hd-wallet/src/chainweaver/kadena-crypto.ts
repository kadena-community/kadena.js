import kadenaCrypto from './vendor/kadena-crypto.js';

const nextTick = () => new Promise((resolve) => process.nextTick(resolve));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const makeAsync = <T extends (...args: any[]) => any>(
  cb: T,
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (...args: any[]): Promise<any> => {
    // kadena-crypto internally loads a wasm module
    // which is an async operation, ensure it is completed
    while (!kadenaCrypto.isLoaded()) {
      await nextTick();
    }
    return cb(...args);
  };
};

export const kadenaMnemonicToRootKeypair = makeAsync(
  kadenaCrypto.kadenaMnemonicToRootKeypair,
);
export const kadenaChangePassword = makeAsync(
  kadenaCrypto.kadenaChangePassword,
);
export const kadenaCheckMnemonic = kadenaCrypto.kadenaCheckMnemonic;
export const kadenaGetPublic = makeAsync(kadenaCrypto.kadenaGetPublic);
export const kadenaSign = makeAsync(kadenaCrypto.kadenaSign);
export const kadenaVerify = makeAsync(kadenaCrypto.kadenaVerify);
export const kadenaGenKeypair = makeAsync(kadenaCrypto.kadenaGenKeypair);
export const kadenaGenMnemonic = kadenaCrypto.kadenaGenMnemonic;
