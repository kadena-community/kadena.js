import * as kadenaCrypto from './vendor/kadena-crypto.cjs';

const nextTick = () => new Promise((resolve) => process.nextTick(resolve));

const makeAsync = <T extends (...args: any[]) => any>(
  cb: T,
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: any[]): Promise<any> => {
    // kadena-crypto internally loads a wasm module
    // which is an async operation, ensure it is completed
    while (!kadenaCrypto.default.isLoaded()) {
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
export const kadenaCheckMnemonic = makeAsync(kadenaCrypto.kadenaCheckMnemonic);
export const kadenaGetPublic = makeAsync(kadenaCrypto.kadenaGetPublic);
export const kadenaSign = makeAsync(kadenaCrypto.kadenaSign);
export const kadenaVerify = makeAsync(kadenaCrypto.kadenaVerify);
export const kadenaGenKeypair = makeAsync(kadenaCrypto.kadenaGenKeypair);
export const kadenaGenMnemonic = kadenaCrypto.kadenaGenMnemonic;
