{
  keyPairs: {
    publicKey: '0b22d1a70e8c1c4e1dde2b4854da48b244b855dac54dbbf3b2b4fc5f9b3fa52d',
    secretKey: 'bcfcbb71a7ae0ed07f27b1336a773d100745a9fcf58ae1241d18107d80602dff'
  },
  envData: { header: { hash: '0xabc', number: 1234, 'receipts-root': '0xabc' } },
  pactCode: `(relay.relay.propose (read-msg 'header) "TestBonder")`,
  meta: {
    ttl: 28800,
    creationTime: 1621656449,
    gasLimit: 100000,
    chainId: '0',
    gasPrice: 1e-10,
    sender: ''
  }
}
> p = pact.fetch.local(cmd, config.PACT_URL);
Promise { <pending> }
> p.then(x => console.log(x))
Promise { <pending> }
> {
  gas: 100000,
  result: {
    status: 'failure',
    error: {
      callStack: [],
      type: 'EvalError',
      message: 'Type error: expected integer, found decimal',
      info: '<interactive>:0:264'
    }
  },
  reqKey: 'cRRJYE5_T_NIEBweqv0ZFny903LKe1W876T7bhoQKoE',
  logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
  metaData: null,
  continuation: null,
  txId: null
}