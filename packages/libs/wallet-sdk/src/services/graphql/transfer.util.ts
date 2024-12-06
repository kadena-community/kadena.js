import type { ChainId } from '@kadena/types';
import type { TransferFieldsFragment } from '../../gql/graphql';
import type { ITransfer } from '../../sdk/interface';
import { parsePactNumber } from '../../utils/pact.util';
import { safeJsonParse } from '../../utils/string.util';
import { isEmpty, notEmpty } from '../../utils/typeUtils';

export type GqlTransfer = TransferFieldsFragment & {
  crossChainTransfer?: TransferFieldsFragment | null;
};

function parseClist(node: GqlTransfer) {
  if (isEmpty(node.transaction)) return [];
  const clist = node.transaction.cmd.signers.flatMap((x) =>
    x.clist
      .map((item) => {
        const args = safeJsonParse<(number | string | object)[]>(item.args);
        if (args === null) return null;
        return { name: item.name, args };
      })
      .filter(notEmpty),
  );
  return clist;
}
type CList = ReturnType<typeof parseClist>;

function parseEvents(node: GqlTransfer) {
  if (
    isEmpty(node.transaction) ||
    node.transaction.result.__typename === 'TransactionMempoolInfo'
  ) {
    return [];
  }
  return node.transaction.result.events.edges
    .flatMap((x) => {
      if (!x) return null;
      const parameters = safeJsonParse<(number | string | object)[]>(
        x.node.parameters,
      );
      if (parameters === null) return null;
      return { name: x.node.name, parameters };
    })
    .filter(notEmpty);
}
type Events = ReturnType<typeof parseEvents>;

type GqlTransferParsed = GqlTransfer & {
  events: Events;
  clist: CList;
  fungibleName: string;
  crossChainTransfer?:
    | (TransferFieldsFragment & {
        events: Events;
        clist: CList;
        fungibleName: string;
      })
    | null;
};

const parseTransfer = (
  node: GqlTransfer,
  fungibleName?: string,
): GqlTransferParsed => {
  return {
    ...node,
    events: parseEvents(node),
    clist: parseClist(node),
    fungibleName: fungibleName ?? node.moduleName,
    crossChainTransfer: node.crossChainTransfer
      ? parseTransfer(node.crossChainTransfer, fungibleName)
      : null,
  };
};

const isTransactionFeeTransfer = (transfer: GqlTransfer) =>
  transfer.orderIndex === 0;

const isSuccess = (transfer: GqlTransfer) => {
  return (
    transfer.transaction?.result.__typename === 'TransactionResult' &&
    Boolean(transfer.transaction.result.goodResult)
  );
};

const matchSender = (
  transfer: GqlTransferParsed,
  arg: number | string | object,
) => {
  return transfer.senderAccount !== '' ? arg === transfer.senderAccount : true;
};
const matchReceiver = (
  transfer: GqlTransferParsed,
  arg: number | string | object,
) => {
  return transfer.receiverAccount !== ''
    ? arg === transfer.receiverAccount
    : true;
};
const matchAmount = (
  transfer: GqlTransferParsed,
  arg: number | string | object,
) => {
  return transfer.amount <= parsePactNumber(arg);
};

const getCrossChainTransferStart = (transfer: GqlTransferParsed) => {
  const match = transfer.events.find(
    (event) =>
      event.name === `TRANSFER_XCHAIN` &&
      matchSender(transfer, event.parameters[0]) &&
      matchReceiver(transfer, event.parameters[1]) &&
      matchAmount(transfer, event.parameters[2]),
  );
  if (isEmpty(match)) return null;
  return {
    receiverAccount: (transfer.receiverAccount ||
      transfer.crossChainTransfer?.receiverAccount ||
      match.parameters[1]) as string,
    senderAccount: (transfer.senderAccount ||
      transfer.crossChainTransfer?.senderAccount ||
      match.parameters[0]) as string,
    targetChainId: String(match.parameters?.[3]) as ChainId,
  };
};

const getCrossChainTransferFinish = (transfer: GqlTransferParsed) => {
  const match = transfer.events.find(
    (event) =>
      event.name === 'TRANSFER_XCHAIN_RECD' &&
      matchSender(transfer, event.parameters[0]) &&
      matchReceiver(transfer, event.parameters[1]) &&
      matchAmount(transfer, event.parameters[2]),
  );

  if (isEmpty(match)) return null;

  return {
    receiverAccount: (transfer.receiverAccount ||
      transfer.crossChainTransfer?.receiverAccount ||
      match.parameters?.[1]) as string,
    senderAccount: (transfer.senderAccount ||
      transfer.crossChainTransfer?.senderAccount ||
      match.parameters?.[0]) as string,
    targetChainId: String(
      transfer.crossChainTransfer?.chainId || match.parameters?.[3],
    ) as ChainId,
  };
};

const mapBaseTransfer = (
  gqlTransfer: GqlTransferParsed,
  lastBlockHeight: number,
): ITransfer => {
  return {
    amount: gqlTransfer.amount,
    chainId: String(gqlTransfer.chainId) as ChainId,
    requestKey: gqlTransfer.requestKey,
    senderAccount: gqlTransfer.senderAccount,
    receiverAccount: gqlTransfer.receiverAccount,
    isCrossChainTransfer: false,
    success: isSuccess(gqlTransfer),
    token: gqlTransfer.fungibleName,
    networkId: gqlTransfer.transaction?.cmd.networkId!,
    block: {
      creationTime: new Date(gqlTransfer.block.creationTime),
      blockDepthEstimate: lastBlockHeight - 3 - gqlTransfer.block.height,
      hash: gqlTransfer.block.hash,
      height: gqlTransfer.block.height,
    },
  };
};

export const gqlTransferToTransfer = (
  rawGqlTransfer: GqlTransfer,
  accountName: string,
  lastBlockHeight: number,
  fungibleName?: string,
): ITransfer | null => {
  const gqlTransfer = parseTransfer(rawGqlTransfer, fungibleName);
  const xChainStart = getCrossChainTransferStart(gqlTransfer);
  const xChainFinish = getCrossChainTransferFinish(gqlTransfer);

  if (xChainStart) {
    const result: ITransfer = {
      ...mapBaseTransfer(gqlTransfer, lastBlockHeight),
      isCrossChainTransfer: true,
      targetChainId: xChainStart.targetChainId,
      receiverAccount: isTransactionFeeTransfer(gqlTransfer)
        ? gqlTransfer.receiverAccount
        : xChainStart.receiverAccount,
    };
    if (gqlTransfer.crossChainTransfer) {
      result.continuation = {
        requestKey: gqlTransfer.crossChainTransfer.requestKey,
        success: isSuccess(gqlTransfer.crossChainTransfer),
      };
    }
    return result;
  }

  if (xChainFinish) {
    // crossChainTransfer can't be null for finish events
    if (!gqlTransfer.crossChainTransfer) return null;
    return {
      ...mapBaseTransfer(gqlTransfer.crossChainTransfer, lastBlockHeight),
      isCrossChainTransfer: true,
      targetChainId: String(gqlTransfer.chainId) as ChainId,
      receiverAccount: xChainFinish.receiverAccount,
      continuation: {
        requestKey: gqlTransfer.requestKey,
        success: isSuccess(gqlTransfer),
      },
    };
  }

  return mapBaseTransfer(gqlTransfer, lastBlockHeight);
};

export function parseGqlTransfers(
  nodes: GqlTransfer[],
  lastBlockHeight: number,
  accountName: string,
  fungibleName?: string,
): ITransfer[] {
  const grouped = nodes.reduce(
    (acc, node) => {
      const key = node.requestKey;
      if (!(key in acc)) acc[key] = [];
      acc[key].push(node);
      return acc;
    },
    {} as Record<string, typeof nodes>,
  );

  const mapped = Object.values(grouped).flatMap((nodes) => {
    const transactionFee = nodes.find((node) => isTransactionFeeTransfer(node));
    const transfers = nodes.filter((node) => !isTransactionFeeTransfer(node));

    // console.log('nodes', nodes);

    // Failed transfers only have the transaction fee transfer
    // For wallets, give the transfer with original amount and receiver
    if (transfers.length === 0) {
      const gqlTransfer = nodes[0];

      if (isSuccess(gqlTransfer)) {
        // eslint-disable-next-line no-console
        console.log(
          'RequestKey found with one one Transfer, but it does not have failed status.',
        );
        return [];
      }

      // Not success, must be a gas payment: Reconstruct original transfer
      const clist = parseClist(gqlTransfer);
      const transferCap = clist.find((x) => x.name === 'coin.TRANSFER')?.args;
      if (isEmpty(transferCap)) return [];
      const transactionFeeTransfer = gqlTransferToTransfer(
        gqlTransfer,
        accountName,
        lastBlockHeight,
        fungibleName,
      );
      if (!transactionFeeTransfer) return [];
      const transfer: ITransfer = {
        ...transactionFeeTransfer,
        receiverAccount: String(transferCap[1]),
        // Could technically be different from the value used in payload.code
        // It would be an improvement to parse code instead of using the cap, but that is very complex.
        amount: parsePactNumber(transferCap[2]),
        success: false,
        transactionFeeTransfer: {
          ...transactionFeeTransfer,
          isBulkTransfer: false,
          success: true,
        },
      };
      return [transfer];
    }

    return transfers.map((gqlTransfer) => {
      const base = gqlTransferToTransfer(
        gqlTransfer,
        accountName,
        lastBlockHeight,
        fungibleName,
      );
      if (!base) return null;
      const transactionFeeBase = transactionFee
        ? gqlTransferToTransfer(
            transactionFee,
            accountName,
            lastBlockHeight,
            fungibleName,
          )
        : null;
      if (transactionFeeBase) {
        return {
          ...base,
          transactionFeeTransfer: {
            ...transactionFeeBase,
            isBulkTransfer: transfers.length > 1,
          },
        } as ITransfer;
      }
      return base;
    });
  });

  return mapped.filter(notEmpty);
}

export function isSameTransfer(transferA: ITransfer, transferB: ITransfer) {
  const isSameBaseTransfer =
    transferA.requestKey === transferB.requestKey &&
    transferA.chainId === transferB.chainId &&
    transferA.senderAccount === transferB.senderAccount &&
    transferA.receiverAccount === transferB.receiverAccount &&
    transferA.amount === transferB.amount &&
    transferA.isCrossChainTransfer === transferB.isCrossChainTransfer;

  if (transferA.isCrossChainTransfer && transferB.isCrossChainTransfer) {
    return (
      isSameBaseTransfer && transferA.targetChainId === transferB.targetChainId
    );
  }

  return isSameBaseTransfer;
}
