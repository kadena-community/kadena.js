//Test Case 1 - 01-system.yaml code from https://github.com/kadena-io/pact/blob/master/examples/accounts/scripts/01-system.yaml
export const network = null;
export const apiHost = 'http://127.0.0.1:9001';
export const kp = {
  publicKey: 'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  secretKey: '8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332',
};
export const nonce = 'step01';
export const pactCode =
  '(define-keyset \'k (read-keyset "accounts-admin-keyset"))\n(module system \'k\n  (defun get-system-time ()\n    (time "2017-10-31T12:00:00Z")))\n(get-system-time)';
export const envData = {
  'accounts-admin-keyset': [
    'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
  ],
};

export const cmd = {
  networkId: null,
  payload: {
    exec: {
      data: envData,
      code: pactCode,
    },
  },
  signers: [
    {
      pubKey:
        'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
    },
  ],
  meta: {
    creationTime: 0,
    ttl: 0,
    gasLimit: 0,
    chainId: '',
    gasPrice: 0,
    sender: '',
  },
  nonce: JSON.stringify(nonce),
};
