import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { dirtyReadClient } from '@kadena/client-utils/core';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import { dotenv } from '@utils/dotenv';

interface ITokenInfo {
  supply: number;
  precision: number;
  uri: string;
  id: string;
  policies: { moduleName: string }[];
}

export const getTokenInfo = async (
  tokenId: string,
  chainId: ChainId,
  version: string,
): Promise<ITokenInfo | null> => {
  if (version !== 'v1' && version !== 'v2') {
    throw new Error(
      `Invalid version found for token ${tokenId}. Got ${version} but expected v1 or v2.`,
    );
  }

  let executionCmd;

  if (version === 'v1') {
    // executionCmd = execution(
    //   Pact.modules['marmalade.ledger']['get-policy-info'](tokenId),
    // );
    executionCmd = execution(`(bind
        (marmalade.ledger.get-policy-info "${tokenId}")
        {"token" := token }
        (bind
            token
            { "id" := id, "precision":= precision, "supply":= supply, "manifest":= manifest }
            { "id": id, "precision": precision, "supply": supply, "uri":
                (format
                    "data:{},{}"
                    [
                      (at 'scheme (at 'uri manifest))
                      (at 'data (at 'uri manifest))
                    ]
                )
            }
        )
    )`);
  } else {
    executionCmd = execution(
      Pact.modules['marmalade-v2.ledger']['get-token-info'](tokenId),
    );
    // executionCmd = execution(`(bind
    //    (marmalade-v2.ledger.get-token-info "${tokenId}")
    //    { "id" := id, "precision":= precision, "supply" := supply, "uri" := uri }
    //    { "id" : id, "precision": precision, "supply" : supply, "uri" : uri }
    //  )`);
  }

  const command = composePactCommand(
    executionCmd,

    setMeta({
      chainId,
    }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: dotenv.NETWORK_ID,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokenInfo = await dirtyReadClient<any>(config)(command).execute();

  if (!tokenInfo) {
    return null;
  }

  // if (version === 'v1') {
  //   if ('token' in tokenInfo) {
  //     tokenInfo = tokenInfo.token;
  //   }

  //   if ('manifest' in tokenInfo) {
  //     tokenInfo.uri = `data:${tokenInfo.manifest.uri.scheme},${tokenInfo.manifest.uri.data}`;
  //   }
  // }

  if ('precision' in tokenInfo) {
    if (
      typeof tokenInfo.precision === 'object' &&
      tokenInfo.precision !== null
    ) {
      tokenInfo.precision = (tokenInfo.precision as { int: number }).int;
    }
  }

  if ('policies' in tokenInfo) {
    if (!Array.isArray(tokenInfo.policies)) {
      tokenInfo.policies = tokenInfo.policies.map((policy: string) => ({
        moduleName: policy,
      }));
    }
  } else if ('policy' in tokenInfo) {
    tokenInfo.policies = { moduleName: tokenInfo.policy.toString() };
  }

  return tokenInfo as ITokenInfo;
};
