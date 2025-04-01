import WalletKit, { WalletKitTypes } from '@reown/walletkit';
import { getSdkError } from '@walletconnect/utils';
import { AccountStore } from './hooks/useAccountStore';
import { ISignResponse, AccountResponse, MessageType, IResponseType } from './wallet-communication';

export async function handleGetAccountsV1(sessionRequest: WalletKitTypes.SessionRequest, currentWalletKit: WalletKit, accountStore: AccountStore) {
  const request = sessionRequest.params.request;
  const { id, topic } = sessionRequest;
  const { params } = request;

  // Get accounts requested by the request
  const requestedAccountsArray = params.accounts;

  const storedAccounts = accountStore[topic];
  if (!storedAccounts) {
    // Handle case where no accounts are found for the given topic/session
    console.warn('No accounts found for topic', topic);
    await currentWalletKit.respondSessionRequest({
      topic,
      response: {
        id,
        jsonrpc: '2.0',
        error: getSdkError('UNSUPPORTED_ACCOUNTS'),
      },
    });
    return;
  }

  const accountsResponse = requestedAccountsArray.map(
    (requestedAccount: { account: string; contracts: string[] }) => {
      return storedAccounts
        .filter((storedAccount) => {
          return (
            requestedAccount.account === storedAccount.name &&
            (requestedAccount.contracts.length === 0 ||
              requestedAccount.contracts.includes(
                storedAccount.account.contract,
              ))
          );
        })
        .map((acc) => {
          return {
            account: acc.name,
            publicKey: acc.publicKey,
            kadenaAccounts: [
              {
                name: acc.account.address,
                contract: acc.account.contract,
                chains: acc.account.chains.map(chain => chain.chainId),
              },
            ],
          };
        })
        .reduce(
          (result: AccountResponse | null, curr: AccountResponse) => {
            if (!result) {
              result = curr;
            } else {
              result.kadenaAccounts = [
                ...result.kadenaAccounts,
                ...curr.kadenaAccounts,
              ];
            }
            return result;
          },
          null,
        );
    },
  );

  await currentWalletKit.respondSessionRequest({
    topic,
    response: {
      id,
      jsonrpc: '2.0',
      result: {
        accounts: accountsResponse,
      },
    },
  });
}

export async function handleSignV1(sessionRequest: WalletKitTypes.SessionRequest, currentWalletKit: WalletKit) {
  const { id, topic } = sessionRequest;
  await currentWalletKit.respondSessionRequest({
    topic,
    response: {
      id,
      jsonrpc: '2.0',
      error: getSdkError('UNSUPPORTED_METHODS'),
    },
  });
}

export async function handleQuickSignV1(sessionRequest: WalletKitTypes.SessionRequest, currentWalletKit: WalletKit, message: <T extends MessageType>(type: MessageType, payload?: Record<string, unknown>) => Promise<IResponseType<T>>) {
  const request = sessionRequest.params.request;
  const { id, topic } = sessionRequest;
  const { params } = request;

  const responses = [];
  for (let i = 0; i < params.commandSigDatas.length; i++) {
    const txObject = params.commandSigDatas[i];
    const response = await message('SIGN_REQUEST', txObject);

    if (response.error) {
      responses.push({
        error: { type: 'reject' }
      });
    } else {
      const { status, transaction } = response.payload as ISignResponse;
      responses.push({
        commandSigData: { cmd: transaction.cmd, sigs: transaction.sigs },
        outcome: {
          result: status === 'signed' ? 'success' : 'noSig',
          hash: transaction.hash
        }
      });
    }
  }

  await currentWalletKit.respondSessionRequest({
    topic,
    response: {
      id,
      jsonrpc: '2.0',
      result: { responses }
    }
  });
}