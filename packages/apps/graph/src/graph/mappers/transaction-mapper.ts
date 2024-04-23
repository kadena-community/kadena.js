import type { Transaction } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mempoolTransactionMapper(mempoolData: any): Transaction {
  const mempoolTx = JSON.parse(mempoolData.contents);

  mempoolTx.cmd = JSON.parse(mempoolTx.cmd);

  if ('cont' in mempoolTx.cmd.payload) {
    mempoolTx.cmd.payload = mempoolTx.cmd.payload.cont;
  } else if ('exec' in mempoolTx.cmd.payload) {
    mempoolTx.cmd.payload = mempoolTx.cmd.payload.exec;
  }

  mempoolTx.cmd.payload.data = JSON.stringify(mempoolTx.cmd.payload.data);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mempoolTx.cmd.signers = mempoolTx.cmd.signers.map((signer: any) => ({
    publicKey: signer.pubKey,
    scheme: signer.scheme,
    requestKey: mempoolTx.hash,
    capabilities: JSON.parse(JSON.stringify(signer.clist)),
    orderIndex: null,
    address: null,
    signature: null,
  }));

  // Convert creationTime to milliseconds (mempool has it in epoch format in seconds)
  mempoolTx.cmd.meta.creationTime = mempoolTx.cmd.meta.creationTime * 1000;

  const transaction = {
    requestKey: mempoolTx.hash,
    badResult: null,
    continuation: null,
    gas: BigInt(0),
    goodResult: null,
    height: BigInt(0),
    logs: null,
    metadata: null,
    eventCount: null,
    transactionId: null,
    blockHash: '',
    chainId: mempoolTx.cmd.meta.chainId,
    code: mempoolTx.cmd.payload.code,
    creationTime: mempoolTx.cmd.meta.creationTime,
    data: mempoolTx.cmd.payload.data,
    gasLimit: BigInt(mempoolTx.cmd.meta.gasLimit),
    gasPrice: mempoolTx.cmd.meta.gasPrice,
    nonce: mempoolTx.cmd.nonce,
    pactId: mempoolTx.cmd.payload.pactId,
    rollback: mempoolTx.cmd.payload.rollback,
    proof: mempoolTx.cmd.payload.proof,
    senderAccount: mempoolTx.cmd.meta.sender,
    step: BigInt(mempoolTx.cmd.payload.step),
    ttl: BigInt(mempoolTx.cmd.meta.ttl),
  };

  return transaction;
}
