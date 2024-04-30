import type { ICommandResult, ITransactionDescriptor } from '@kadena/client';
import { createClient } from '@kadena/client';
import { describeModule } from '@kadena/client-utils';
import type { ChainId } from '@kadena/types';

import deployDevNetFaucet from '../../devnet/faucet/deploy/index.js';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import type { CommandResult } from '../../utils/command.util.js';
import { notEmpty } from '../../utils/globalHelpers.js';
import { log } from '../../utils/logger.js';
import { getTransactionExplorerUrl } from './accountHelpers.js';

function isSuccessOrPartialSuccess(
  result: CommandResult<ITransactionDescriptor[]>,
): boolean {
  return result.status === 'success' || result.status === 'partial';
}

export function logTransactionExplorerUrls(
  result: CommandResult<ITransactionDescriptor[]>,
  networkExplorerUrl: string,
): void {
  if (
    isSuccessOrPartialSuccess(result) &&
    'data' in result &&
    result.data.length > 0
  ) {
    log.info(log.color.green('Transaction explorer URL for '));
    for (const { chainId, requestKey } of result.data) {
      const explorerUrl = getTransactionExplorerUrl(
        networkExplorerUrl,
        requestKey,
      );
      log.info(log.color.green(`Chain ID "${chainId}" : ${explorerUrl}`));
    }
  }
}

async function fetchTransactionDetails(
  transaction: ITransactionDescriptor,
  networkHost: string,
  networkId: string,
): Promise<ICommandResult | null> {
  const { requestKey, chainId } = transaction;
  try {
    const { pollStatus } = createClient(
      `${networkHost}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    );
    const response = await pollStatus(transaction);
    const transactionResult = response[requestKey];
    if (
      typeof transactionResult !== 'string' &&
      transactionResult.result.status === 'failure'
    ) {
      throw transactionResult.result.error;
    }
    return transactionResult;
  } catch (e) {
    throw new Error(
      `ChainID: "${chainId}" - requestKey: ${requestKey} - ${e.message}`,
    );
  }
}

interface ITxResultByChainId {
  [key: string]: ICommandResult;
}

export async function getTxDetails(
  data: ITransactionDescriptor[],
  networkHost: string,
  networkId: string,
): Promise<{
  txResults: ITxResultByChainId[];
  txErrors: string[];
}> {
  const txErrors: string[] = [];
  const txResultsPromises = data.map(async (transaction) => {
    const { requestKey, chainId } = transaction;
    try {
      const transactionResult = await fetchTransactionDetails(
        transaction,
        networkHost,
        networkId,
      );
      if (transactionResult !== null) {
        return { [chainId]: transactionResult };
      }
    } catch (e) {
      txErrors.push(
        `ChainID: "${chainId}" - requestKey: ${requestKey} - ${e.message}`,
      );
    }
  });

  const txResults = (await Promise.all(txResultsPromises)).filter(notEmpty);

  return { txResults, txErrors };
}

export function logAccountFundingTxResults(
  txResults: ITxResultByChainId[],
  txErrors: string[],
  accountName: string,
  fungible: string,
  amount: string,
  networkId: string,
): void {
  if (txResults.length > 0) {
    const chainIds = txResults
      .map((obj) => Object.keys(obj))
      .flat()
      .join(', ');
    log.info(
      log.color.green(
        `\nAccount "${accountName}" funded with ${amount} ${fungible}(s) on Chain ID(s) "${chainIds}" in ${networkId} network.`,
      ),
    );
    log.info(
      log.color.green(
        `Use "kadena account details" command to check the balance.`,
      ),
    );
  }

  if (txErrors.length > 0) {
    log.error('Failed to fund account on following:');
    txErrors.forEach((error: string) => {
      log.error(error);
    });
  }
}

export async function findMissingModuleDeployments(
  moduleName: string,
  network: Pick<INetworkCreateOptions, 'networkId' | 'networkHost'>,
  targetChainIds: ChainId[],
): Promise<ChainId[]> {
  const undeployedChainIds: ChainId[] = [];

  for (const chainId of targetChainIds) {
    const moduleDeployed = await describeModule(moduleName, {
      host: network.networkHost,
      defaults: {
        networkId: network.networkId,
        meta: { chainId },
      },
    }).catch(() => false);

    if (moduleDeployed === false) {
      undeployedChainIds.push(chainId);
    }
  }

  return undeployedChainIds;
}

interface IFaucetDeployFailedResult {
  chainId: ChainId;
  message: string;
}

export async function deployFaucetsToChains(
  chainIds: ChainId[],
): Promise<[ChainId[], IFaucetDeployFailedResult[]]> {
  const succeededDeployments: ChainId[] = [];
  const failedDeployments: IFaucetDeployFailedResult[] = [];
  await Promise.all(
    chainIds.map(async (chainId) => {
      try {
        await deployDevNetFaucet(chainId);
        succeededDeployments.push(chainId);
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        failedDeployments.push({ message: message, chainId });
      }
    }),
  );

  return [succeededDeployments, failedDeployments];
}
