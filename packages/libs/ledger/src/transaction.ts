import blake2b from 'blake2b';

export type TransactionParams = {
  type: 'transfer' | 'cross-chain-transfer';
  recipient: string;
  recipientChainId: string;
  networkId: string;
  amount: number;
  namespace_: string;
  module_: string;
  gasPrice: string;
  gasLimit: string;
  creationTime: string;
  chainId: string;
  nonce: string;
  ttl: string;
};

/***
 * The ledger Kadena app by default does not just accept a hash and signs it.
 * It accepts all parameters and builds the transaction itself
 * hashes it, and provides the signature for that.
 *
 * This means to use the signature you need an exact match of the transaction.
 * This is why @kadena/client can not be used, and we create the transaction here.
 */
export function createTransaction(
  {
    type,
    recipient,
    recipientChainId,
    networkId,
    amount,
    namespace_,
    module_,
    gasPrice,
    gasLimit,
    creationTime,
    chainId,
    nonce,
    ttl,
  }: TransactionParams,
  pubKey: string,
) {
  // Build the JSON, exactly like the Ledger app
  var cmd = '{"networkId":"' + networkId + '"';
  if (type === 'transfer') {
    cmd += ',"payload":{"exec":{"data":{},"code":"';
    if (namespace_ === '') {
      cmd += '(coin.transfer';
    } else {
      cmd += '(' + namespace_ + '.' + module_ + '.transfer';
    }
    cmd += ' \\"k:' + pubKey + '\\"';
    cmd += ' \\"k:' + recipient + '\\"';
    cmd += ' ' + amount + ')"}}';
    cmd += ',"signers":[{"pubKey":"' + pubKey + '"';
    cmd +=
      ',"clist":[{"args":["k:' +
      pubKey +
      '","k:' +
      recipient +
      '",' +
      amount +
      ']';
    if (namespace_ === '') {
      cmd += ',"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]}]';
    } else {
      cmd +=
        ',"name":"' +
        namespace_ +
        '.' +
        module_ +
        '.TRANSFER"},{"args":[],"name":"coin.GAS"}]}]';
    }
  } else if (type === 'cross-chain-transfer') {
    cmd += ',"payload":{"exec":{"data":{';
    cmd += '"ks":{"pred":"keys-all","keys":["' + recipient + '"]}';
    cmd += '},"code":"';
    if (namespace_ === '') {
      cmd += '(coin.transfer-create';
    } else {
      cmd += '(' + namespace_ + '.' + module_ + '.transfer-create';
    }
    cmd += ' \\"k:' + pubKey + '\\"';
    cmd += ' \\"k:' + recipient + '\\"';
    cmd += ' (read-keyset \\"ks\\")';
    cmd += ' ' + amount + ')"}}';
    cmd += ',"signers":[{"pubKey":"' + pubKey + '"';
    cmd +=
      ',"clist":[{"args":["k:' +
      pubKey +
      '","k:' +
      recipient +
      '",' +
      amount +
      ']';
    if (namespace_ === '') {
      cmd += ',"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]}]';
    } else {
      cmd +=
        ',"name":"' +
        namespace_ +
        '.' +
        module_ +
        '.TRANSFER"},{"args":[],"name":"coin.GAS"}]}]';
    }
  } else {
    cmd += ',"payload":{"exec":{"data":{';
    cmd += '"ks":{"pred":"keys-all","keys":["' + recipient + '"]}';
    cmd += '},"code":"';
    if (namespace_ === '') {
      cmd += '(coin.transfer-crosschain';
    } else {
      cmd += '(' + namespace_ + '.' + module_ + '.transfer-crosschain';
    }
    cmd += ' \\"k:' + pubKey + '\\"';
    cmd += ' \\"k:' + recipient + '\\"';
    cmd += ' (read-keyset \\"ks\\")';
    cmd += ' \\"' + recipientChainId + '\\"';
    cmd += ' ' + amount + ')"}}';
    cmd += ',"signers":[{"pubKey":"' + pubKey + '"';
    cmd +=
      ',"clist":[{"args":["k:' +
      pubKey +
      '","k:' +
      recipient +
      '",' +
      amount +
      ',"' +
      recipientChainId +
      '"]';
    if (namespace_ === '') {
      cmd += ',"name":"coin.TRANSFER_XCHAIN"},{"args":[],"name":"coin.GAS"}]}]';
    } else {
      cmd +=
        ',"name":"' +
        namespace_ +
        '.' +
        module_ +
        '.TRANSFER_XCHAIN"},{"args":[],"name":"coin.GAS"}]}]';
    }
  }
  cmd += ',"meta":{"creationTime":' + creationTime.toString();
  cmd +=
    ',"ttl":' +
    ttl +
    ',"gasLimit":' +
    gasLimit +
    ',"chainId":"' +
    chainId +
    '"';
  cmd +=
    ',"gasPrice":' +
    gasPrice +
    ',"sender":"k:' +
    pubKey +
    '"},"nonce":"' +
    nonce +
    '"}';

  const hash_bytes = blake2b(32).update(new TextEncoder().encode(cmd)).digest();
  const hash = btoa(String.fromCharCode.apply(null, [...hash_bytes]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, ''); // base64url encode, remove padding

  return {
    cmd,
    hash,
  };
}
