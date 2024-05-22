export const accountDetailsSuccessData = {
  result: {
    data: {
      guard: {
        keys: ['publicKey1', 'publicKey2'],
        pred: 'keys-all',
      },
      account: 'accountName',
      balance: 0,
    },
    status: 'success',
  },
};

export const createPrincipalSuccessData = {
  result: {
    data: 'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
    status: 'success',
  },
};

export const pollTxResponseMock = {
  'requestKey-1': {
    gas: 994,
    result: {
      status: 'success',
      data: 'Write succeeded',
    },
    reqKey: 'requestKey-1',
    logs: 'X5qsmQLpPAZssdJhmkk22WvnCVeo2KfFaHE3Rgabl5w',
    events: [
      {
        params: [
          'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
          'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
          0.00000994,
        ],
        name: 'TRANSFER',
        module: {
          namespace: null,
          name: 'coin',
        },
        moduleHash: 'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s',
      },
      {
        params: [
          'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
          'w:yCvUbeS6RqdKsY3WBDB3cgK-6q790xkj4Hb-ABpu3gg:keys-all',
          20,
        ],
        name: 'TRANSFER',
        module: {
          namespace: null,
          name: 'coin',
        },
        moduleHash: 'klFkrLfpyLW-M3xjVPSdqXEMgxPPJibRt_D6qiBws6s',
      },
    ],
    metaData: {
      blockTime: 1715765090739832,
      prevBlockHash: 'WxkiaCln5K-895sWxWzhEEzojoEz7SkQ9NTOWTTg5JA',
      blockHash: 'aomNircGIemvQZlKY91x51qp_57a6VCuucomZlHmP8s',
      blockHeight: 4292951,
    },
    continuation: null,
    txId: 4303163,
  },
};
