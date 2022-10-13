import Pact from 'pact-lang-api';
import { DefaultQueryParams, queryParamsTypeAdapter } from '../utils/api';
import { getPactHost, getKeyPairsFromSeedPhrase } from 'utils';

interface AccountGenQueryParams extends DefaultQueryParams {
  accountName: string;
  privateKey?: string;
  seeds?: string;
  accountIndex?: number;
  instance: string;
  version: string;
  chainId: string;
  customHost?: string | undefined | null;
}

type AccountDetailsResult = null | {
  accountName: string;
  publicKey: string;
  privateKey?: string;
};

export const getAccountDetails: (
  params: AccountGenQueryParams,
) => Promise<AccountDetailsResult> = async (params: AccountGenQueryParams) => {
  const {
    customHost,
    privateKey,
    seeds,
    accountIndex,
    accountName,
    network,
    instance,
    version,
    chainId,
  } = queryParamsTypeAdapter<AccountGenQueryParams>(params);
  if (
    !network ||
    !version ||
    !instance ||
    chainId === undefined ||
    !accountName
  ) {
    return null;
  }
  let publicCodeFromRequest;
  if (privateKey) {
    const { publicKey: publicCodeFromPact } =
      Pact.crypto.restoreKeyPairFromSecretKey(privateKey.slice(0, 64));
    publicCodeFromRequest = publicCodeFromPact;
  }
  if (!publicCodeFromRequest && seeds) {
    const { publicKey: publicCodeFromPact } = getKeyPairsFromSeedPhrase(
      seeds,
      Number(accountIndex || 0),
    );
    publicCodeFromRequest = publicCodeFromPact;
  }
  const createTime = () => Math.round(new Date().getTime() / 1000) - 60;
  const detailsResponse = await Pact.fetch.local(
    {
      pactCode: `(coin.details ${JSON.stringify(accountName)})`,
      keyParis: [],
      meta: Pact.lang.mkMeta(
        'not-real',
        chainId,
        0.00000001,
        6000,
        createTime(),
        600,
      ),
    },
    getPactHost(network, version, instance, chainId, customHost),
  );
  if (detailsResponse.result.status !== 'failure') {
    if (detailsResponse.result.data.guard.keysetref) {
      const keySetResponse = await Pact.fetch.local(
        {
          pactCode: `(describe-keyset ${JSON.stringify(
            detailsResponse.result.data.guard.keysetref,
          )})`,
          meta: Pact.lang.mkMeta('', '', 0.00001, 600, createTime(), 28800),
        },
        getPactHost(network, version, instance, chainId, customHost),
      );
      const publicKey = keySetResponse.result.data.keys[0];
      if (!privateKey || publicCodeFromRequest === publicKey) {
        return {
          accountName,
          publicKey,
          privateKey,
        };
      }
    }
    if (detailsResponse.result.data.guard.keys) {
      const publicKey = detailsResponse.result.data.guard.keys[0];
      if (!privateKey || publicCodeFromRequest === publicKey) {
        return {
          accountName,
          publicKey,
          privateKey,
        };
      }
    }
    if (
      'fun' in detailsResponse.result.data.guard &&
      'args' in detailsResponse.result.data.guard
    ) {
      const guardFun = detailsResponse.result.data.guard.fun;
      const [ksRef, afterDateFun] = detailsResponse.result.data.guard.args;
      if (
        guardFun === 'util.guards.enforce-and' &&
        'keysetref' in ksRef &&
        afterDateFun.fun === 'util.guards.enforce-after-date'
      ) {
        const keySetResponse = await Pact.fetch.local(
          {
            pactCode: `(describe-keyset ${JSON.stringify(ksRef.keysetref)})`,
            meta: Pact.lang.mkMeta('', '', 0.00001, 600, createTime(), 28800),
          },
          getPactHost(network, version, instance, chainId, customHost),
        );
        const publicKey = keySetResponse.result.data.keys[0];
        if (!privateKey || publicCodeFromRequest === publicKey) {
          return {
            accountName,
            publicKey,
            privateKey,
          };
        }
      }
    }
  }
  return null;
};
