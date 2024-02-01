import { createClient, createTransaction } from '@kadena/client';
import { composePactCommand } from '@kadena/client/fp';
import { hash as hashFunction } from '@kadena/cryptography-utils';
import { dotenv } from '@utils/dotenv';
import { GasLimitEstimation } from '../../graph/types/graphql-types';

export const estimateGasLimit = async (
  input: string,
): Promise<GasLimitEstimation> => {
  const returnValue: GasLimitEstimation = {
    amount: 0,
    type: '',
    usedPreflight: false,
    usedSignatureVerification: false,
    usedTransaction: false,
  };

  if (input.startsWith('(')) {
    returnValue.type = 'code';

    returnValue.usedPreflight = false;
    returnValue.usedSignatureVerification = false;

    const result = await createClient(
      ({ chainId }) =>
        `${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
    ).local(
      createTransaction(
        composePactCommand({
          payload: {
            exec: {
              code: input,
            },
          },
        })(),
      ),
      {
        preflight: returnValue.usedPreflight,
        signatureVerification: returnValue.usedSignatureVerification,
      },
    );

    returnValue.amount = result.gas;
  }

  return returnValue;
};
