import { prismaClient } from '@db/prisma-client';
import { mempoolLookup } from '@services/chainweb-node/mempool';
import type { IContext } from '../builder';
import { builder } from '../builder';
import { GQLTransactionSubscriptionResponse } from '../objects/transaction-subscription';
import type { TransactionSubscriptionResponse } from '../types/graphql-types';

builder.subscriptionField('transactionStatus', (t) =>
  t.field({
    description:
      'Listen for a transaction by request key. Returns the ID when it is in a block.',
    args: {
      requestKey: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
    },
    type: GQLTransactionSubscriptionResponse,
    nullable: true,
    subscribe: (__root, args, context) =>
      iteratorFn(args.requestKey, args.chainId, context),
    resolve: (parent) => parent,
  }),
);

async function* iteratorFn(
  requestKey: string,
  chainId: string,
  context: IContext,
): AsyncGenerator<TransactionSubscriptionResponse | undefined, void, unknown> {
  while (!context.req.socket.destroyed) {
    const transaction = await prismaClient.transaction.findFirst({
      where: {
        requestKey: requestKey,
        chainId: parseInt(chainId),
      },
    });

    if (transaction) {
      yield { transaction, status: 'COMPLETED' };
      return;
    } else {
      const mempoolResponse = await checkMempoolForTransaction(
        requestKey,
        chainId,
      );

      if (mempoolResponse) {
        yield mempoolResponse;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function checkMempoolForTransaction(
  hash: string,
  chainId: string,
): Promise<TransactionSubscriptionResponse> {
  try {
    const tx = {
      tag: 'Pending',
      contents:
        '{"hash":"x7G18lwQ3Ney4vu29chwciQnCR1u2OTptk1g1Hqll0k","sigs":[{"sig":"99e3d2eae9706915b5a718105d16e70e8fc93990beda655a3afa72a3e59c397dd041be4b5eb7fc3388f97921a5740695613d8098edb6ac3b00568089b8be2a0a"}],"cmd":"{\\"payload\\":{\\"cont\\":{\\"data\\":{},\\"pactId\\":\\"ZEU0IcpgDhfSwkfveb02B6mug1oabqVkA7xAq7J8lbY\\",\\"step\\":1,\\"proof\\":\\"eyJjaGFpbiI6MSwib2JqZWN0IjoiQUFBQUVBQUFBQUFBQUFBQkFDN1Z3V2tYLVNBLWNzVDhMWVlVOTBnMmNZZkQ0cFFOMnhzR1o3dzkwcTJ5QUNXMWVmeFNsSU44Q3AwUGd2Z18tRFFwc09CblY1Q2FHNVZfcXo1V2FfZlpBZWhPUk94V0FyQmJ1emV2dktNR1BlMHVGVV9QTzJ6MzdULS1jS2F0NnV3ekFVeDFGdW5TdF95X2FMWHlGckFXX2YtaXEwWUZ4NGhzc1NuT2ZvdndlYklIQUtjN083N2FIVE5jLUNPNE45d1NIZkZ0WktKOWc5QVNsLXFLSzlnRFRFMXNBV0VMdUpfb0VDSnBhRUI3MWZzcnNMbTc3QTZEQnEwdlRPYUdWSkw4Sk5yMEFIWnJicnIwc24tbkp3N1E2ZGxfSDdRVW1aNXM5QjMwZlQtYkdjbzB0RmF2QUdNVEtKME1iem4zWXFHNWNVbTB2SHZ2WDhHRlI1SGozbDlBS1E2REVwM0FBY3lCcjIzYnB1ZmVZYVdKMFJnZXk3cjJ3MldyQkUwZm5JTzdCQ0dwTVdPT0FITVRFLWlaaWFuTGhmd1QtRW9kLXFFdVYwMUdTSVp1cHhIWDYxQU5fN285QVZUUkhMNDRHRHdLN0MwN0N2cGdFQ1gwSS1ROER6NmJQYlA3VjFqdTluMnFBQUhXaXlFTzdSX1BUQjlJeGJrWGo1ZEpkRzZtYlVGOWVsUGR6TkhJTlBnZkFDQnc3eDNrckpBYTFpcmtucTJlVW9jT0ttZVIxTWloWFR2b3VjcV9oazZfQUxGZElCNEttS1JtT0NmVTlSNU41SEpLR3VIa0FyX0c5MVZZOGhRb19SbjZBRW9qNjBRZGItNEQ4OEotM0sxWGlzQ2RqczZYOTljME80UTVBSVJPYm90VkFLbVZHdXN3T2Q2QVgtWTh5TWhpckRaS1pwUlBDdU9yb1pVdm1DN2JORkRSIiwic3ViamVjdCI6eyJpbnB1dCI6IkFCUjdJbWRoY3lJNk5UazRMQ0p5WlhOMWJIUWlPbnNpYzNSaGRIVnpJam9pYzNWalkyVnpjeUlzSW1SaGRHRWlPbnNpWVcxdmRXNTBJanA3SW1SbFkybHRZV3dpT2lJeE5qWTJOall1TmpZMk5qWTJOalkyTmpZaWZTd2ljbVZqWldsMlpYSWlPaUpyT2pFek1EUmtOVGcwWkdVeVlURXdNVEkyTkdKaVpqSmtaR0V4TnpOaFltTmtZV1JqWldZNU9HSTJZbVJtWTJJd1lqaGhNMkUxTXpsbFpXUXdPVGt4TmpJaUxDSnpiM1Z5WTJVdFkyaGhhVzRpT2lJd0lpd2ljbVZqWldsMlpYSXRaM1ZoY21RaU9uc2ljSEpsWkNJNkltdGxlWE10WVd4c0lpd2lhMlY1Y3lJNld5SXhNekEwWkRVNE5HUmxNbUV4TURFeU5qUmlZbVl5WkdSaE1UY3pZV0pqWkdGa1kyVm1PVGhpTm1Ka1ptTmlNR0k0WVROaE5UTTVaV1ZrTURrNU1UWXlJbDE5Zlgwc0luSmxjVXRsZVNJNklscEZWVEJKWTNCblJHaG1VM2RyWm5abFlqQXlRalp0ZFdjeGIyRmljVlpyUVRkNFFYRTNTamhzWWxraUxDSnNiMmR6SWpvaWNYQlRUVTVtTkU1S1FUZGhORWRYUlV0M1YyRTFSRmxKUkhaa1RVczJlaTFsWVV0M1JsY3lNVTl0VVNJc0ltVjJaVzUwY3lJNlczc2ljR0Z5WVcxeklqcGJJbk5sYm1SbGNqQXdJaXdpYXpwbU9EbGxaalEyT1RJM1pqVXdObU0zTUdJMllUVTRabVF6TWpJME5UQmhPVE0yTXpFeFpHTTJZV001TVdZMFpXTXpaRGhsWmprME9UWXdPR1JpWmpGbUlpdzFMams0WlMwMlhTd2libUZ0WlNJNklsUlNRVTVUUmtWU0lpd2liVzlrZFd4bElqcDdJbTVoYldWemNHRmpaU0k2Ym5Wc2JDd2libUZ0WlNJNkltTnZhVzRpZlN3aWJXOWtkV3hsU0dGemFDSTZJbmRQVkdwT1F6Tm5kRTlCYW5GblExazRVemxvVVMxTVFtbDNZMUJWUlRkcU5HbENSRVV3Vkcxa1NtOGlmU3g3SW5CaGNtRnRjeUk2V3lKelpXNWtaWEl3TUNJc0ltczZNVE13TkdRMU9EUmtaVEpoTVRBeE1qWTBZbUptTW1Sa1lURTNNMkZpWTJSaFpHTmxaams0WWpaaVpHWmpZakJpT0dFellUVXpPV1ZsWkRBNU9URTJNaUlzZXlKa1pXTnBiV0ZzSWpvaU1UWTJOalkyTGpZMk5qWTJOalkyTmpZMkluMHNJakVpWFN3aWJtRnRaU0k2SWxSU1FVNVRSa1ZTWDFoRFNFRkpUaUlzSW0xdlpIVnNaU0k2ZXlKdVlXMWxjM0JoWTJVaU9tNTFiR3dzSW01aGJXVWlPaUpqYjJsdUluMHNJbTF2WkhWc1pVaGhjMmdpT2lKM1QxUnFUa016WjNSUFFXcHhaME5aT0ZNNWFGRXRURUpwZDJOUVZVVTNhalJwUWtSRk1GUnRaRXB2SW4wc2V5SndZWEpoYlhNaU9sc2ljMlZ1WkdWeU1EQWlMQ0lpTEhzaVpHVmphVzFoYkNJNklqRTJOalkyTmk0Mk5qWTJOalkyTmpZMk5pSjlYU3dpYm1GdFpTSTZJbFJTUVU1VFJrVlNJaXdpYlc5a2RXeGxJanA3SW01aGJXVnpjR0ZqWlNJNmJuVnNiQ3dpYm1GdFpTSTZJbU52YVc0aWZTd2liVzlrZFd4bFNHRnphQ0k2SW5kUFZHcE9Rek5uZEU5QmFuRm5RMWs0VXpsb1VTMU1RbWwzWTFCVlJUZHFOR2xDUkVVd1ZHMWtTbThpZlN4N0luQmhjbUZ0Y3lJNld5SXhJaXdpWTI5cGJpNTBjbUZ1YzJabGNpMWpjbTl6YzJOb1lXbHVJaXhiSW5ObGJtUmxjakF3SWl3aWF6b3hNekEwWkRVNE5HUmxNbUV4TURFeU5qUmlZbVl5WkdSaE1UY3pZV0pqWkdGa1kyVm1PVGhpTm1Ka1ptTmlNR0k0WVROaE5UTTVaV1ZrTURrNU1UWXlJaXg3SW5CeVpXUWlPaUpyWlhsekxXRnNiQ0lzSW10bGVYTWlPbHNpTVRNd05HUTFPRFJrWlRKaE1UQXhNalkwWW1KbU1tUmtZVEUzTTJGaVkyUmhaR05sWmprNFlqWmlaR1pqWWpCaU9HRXpZVFV6T1dWbFpEQTVPVEUyTWlKZGZTd2lNU0lzZXlKa1pXTnBiV0ZzSWpvaU1UWTJOalkyTGpZMk5qWTJOalkyTmpZMkluMWRYU3dpYm1GdFpTSTZJbGhmV1VsRlRFUWlMQ0p0YjJSMWJHVWlPbnNpYm1GdFpYTndZV05sSWpwdWRXeHNMQ0p1WVcxbElqb2ljR0ZqZENKOUxDSnRiMlIxYkdWSVlYTm9Jam9pZDA5VWFrNURNMmQwVDBGcWNXZERXVGhUT1doUkxVeENhWGRqVUZWRk4ybzBhVUpFUlRCVWJXUktieUo5WFN3aWJXVjBZVVJoZEdFaU9tNTFiR3dzSW1OdmJuUnBiblZoZEdsdmJpSTZleUpsZUdWamRYUmxaQ0k2Ym5Wc2JDd2ljR0ZqZEVsa0lqb2lXa1ZWTUVsamNHZEVhR1pUZDJ0bWRtVmlNREpDTm0xMVp6RnZZV0p4Vm10Qk4zaEJjVGRLT0d4aVdTSXNJbk4wWlhCSVlYTlNiMnhzWW1GamF5STZabUZzYzJVc0luTjBaWEFpT2pBc0lubHBaV3hrSWpwN0ltUmhkR0VpT25zaVlXMXZkVzUwSWpwN0ltUmxZMmx0WVd3aU9pSXhOalkyTmpZdU5qWTJOalkyTmpZMk5qWWlmU3dpY21WalpXbDJaWElpT2lKck9qRXpNRFJrTlRnMFpHVXlZVEV3TVRJMk5HSmlaakprWkdFeE56TmhZbU5rWVdSalpXWTVPR0kyWW1SbVkySXdZamhoTTJFMU16bGxaV1F3T1RreE5qSWlMQ0p6YjNWeVkyVXRZMmhoYVc0aU9pSXdJaXdpY21WalpXbDJaWEl0WjNWaGNtUWlPbnNpY0hKbFpDSTZJbXRsZVhNdFlXeHNJaXdpYTJWNWN5STZXeUl4TXpBMFpEVTROR1JsTW1FeE1ERXlOalJpWW1ZeVpHUmhNVGN6WVdKalpHRmtZMlZtT1RoaU5tSmtabU5pTUdJNFlUTmhOVE01WldWa01EazVNVFl5SWwxOWZTd2ljMjkxY21ObElqb2lNQ0lzSW5CeWIzWmxibUZ1WTJVaU9uc2lkR0Z5WjJWMFEyaGhhVzVKWkNJNklqRWlMQ0p0YjJSMWJHVklZWE5vSWpvaWQwOVVhazVETTJkMFQwRnFjV2REV1RoVE9XaFJMVXhDYVhkalVGVkZOMm8wYVVKRVJUQlViV1JLYnlKOWZTd2lZMjl1ZEdsdWRXRjBhVzl1SWpwN0ltRnlaM01pT2xzaWMyVnVaR1Z5TURBaUxDSnJPakV6TURSa05UZzBaR1V5WVRFd01USTJOR0ppWmpKa1pHRXhOek5oWW1Oa1lXUmpaV1k1T0dJMlltUm1ZMkl3WWpoaE0yRTFNemxsWldRd09Ua3hOaklpTEhzaWNISmxaQ0k2SW10bGVYTXRZV3hzSWl3aWEyVjVjeUk2V3lJeE16QTBaRFU0TkdSbE1tRXhNREV5TmpSaVltWXlaR1JoTVRjellXSmpaR0ZrWTJWbU9UaGlObUprWm1OaU1HSTRZVE5oTlRNNVpXVmtNRGs1TVRZeUlsMTlMQ0l4SWl4N0ltUmxZMmx0WVd3aU9pSXhOalkyTmpZdU5qWTJOalkyTmpZMk5qWWlmVjBzSW1SbFppSTZJbU52YVc0dWRISmhibk5tWlhJdFkzSnZjM05qYUdGcGJpSjlMQ0p6ZEdWd1EyOTFiblFpT2pKOUxDSjBlRWxrSWpvME1UUTJmUSJ9LCJhbGdvcml0aG0iOiJTSEE1MTJ0XzI1NiJ9\\",\\"rollback\\":false}},\\"meta\\":{\\"gasLimit\\":2500,\\"gasPrice\\":1e-8,\\"sender\\":\\"sender00\\",\\"ttl\\":28800,\\"creationTime\\":1710151497,\\"chainId\\":\\"1\\"},\\"signers\\":[{\\"pubKey\\":\\"368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca\\",\\"scheme\\":\\"ED25519\\",\\"clist\\":[{\\"name\\":\\"coin.GAS\\",\\"args\\":[]}]}],\\"nonce\\":\\"kjs:nonce:1710151497971\\",\\"networkId\\":\\"development\\"}"}',
    };

    return {
      status: 'PENDING',
      //@ts-ignore
      transaction: mempoolTxMapper(tx.contents),
    };

    // const mempoolData = await mempoolLookup(hash, chainId);
    // console.log(mempoolData);
    // if (mempoolData.length === 0) {
    //   return {
    //     status: 'MISSING',
    //     transaction: null,
    //   };
    // }

    // const transactionData = mempoolData[0];

    // if (transactionData.tag === 'Missing') {
    //   return {
    //     status: 'MISSING',
    //     transaction: null,
    //   };
    // }

    // if (transactionData.tag === 'Pending') {
    //   console.log('Pending', transactionData);
    //   const transactionBody = JSON.parse(transactionData.contents);
    //   console.log(transactionBody);
    //   return {
    //     status: 'PENDING',
    //     transaction: JSON.parse(transactionData.contents),
    //   };
    // }

    // return {
    //   status: 'MISSING',
    //   transaction: null,
    // };
  } catch (error) {
    return {
      status: 'MISSING',
      transaction: null,
    };
  }
}

function mempoolTxMapper(mempoolContents: any) {
  let mempoolTx = JSON.parse(mempoolContents);

  mempoolTx.cmd = JSON.parse(mempoolTx.cmd);

  if ('cont' in mempoolTx.cmd.payload) {
    mempoolTx.cmd.payload = mempoolTx.cmd.payload.cont;
  } else if ('exec' in mempoolTx.cmd.payload) {
    mempoolTx.cmd.payload = mempoolTx.cmd.payload.exec;
  }

  mempoolTx.cmd.payload.data = JSON.stringify(mempoolTx.cmd.payload.data);

  // console.log(mempoolTx.cmd.signers);
  // console.log(mempoolTx.cmd.signers[0].clist);

  return {
    requestKey: mempoolTx.hash,
    cmd: mempoolTx.cmd,
    // result: null,
  };
}
