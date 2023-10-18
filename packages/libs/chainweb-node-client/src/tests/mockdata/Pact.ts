import type { ICommandPayload } from '@kadena/types';
import type { ISPVRequestBody, SPVResponse } from '../../interfaces/PactAPI';

export const testURL: string = 'https://fake-api-host.local.co';

export const pactTestCommand: ICommandPayload = {
  networkId: null,
  payload: {
    exec: {
      data: {
        'accounts-admin-keyset': [
          'ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d',
        ],
      },
      code: '(define-keyset \'k (read-keyset "accounts-admin-keyset"))\n(module system \'k\n  (defun get-system-time ()\n    (time "2017-10-31T12:00:00Z")))\n(get-system-time)',
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
    chainId: '0',
    gasPrice: 0,
    sender: '',
  },
  nonce: JSON.stringify('step01'),
};

export const testInitiateSPV: object = {
  'zflBHR6QJBR78rdiOu6Hr-zCwDTOEOeBamsjtUX94Zk': {
    gas: 444,
    result: {
      status: 'success',
      data: {
        amount: 0.01,
        receiver:
          '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
        'source-chain': '0',
        'receiver-guard': {
          pred: 'keys-all',
          keys: [
            '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
          ],
        },
      },
    },
    reqKey: 'zflBHR6QJBR78rdiOu6Hr-zCwDTOEOeBamsjtUX94Zk',
    logs: 'Z9ujvdCLIuailLr2y9G3ESa_95Er1mV6utQVuWhUUv0',
    events: [
      {
        params: [
          '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
          'k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
          0.00444,
        ],
        name: 'TRANSFER',
        module: { namespace: null, name: 'coin' },
        moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
      },
      {
        params: [
          '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
          '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
          0.01,
          '1',
        ],
        name: 'TRANSFER_XCHAIN',
        module: { namespace: null, name: 'coin' },
        moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
      },
      {
        params: [
          '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
          '',
          0.01,
        ],
        name: 'TRANSFER',
        module: { namespace: null, name: 'coin' },
        moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
      },
      {
        params: [
          '1',
          'coin.transfer-crosschain',
          [
            '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
            '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
            {
              pred: 'keys-all',
              keys: [
                '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
              ],
            },
            '1',
            0.01,
          ],
        ],
        name: 'X_YIELD',
        module: { namespace: null, name: 'pact' },
        moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
      },
    ],
    metaData: {
      blockTime: 1656709048955370,
      prevBlockHash: 'LD_o60RB4xnMgLyzkedNV6v-hbCCnx6WXRQy9WDKTgs',
      blockHash: 'kZCKTbL3ubONngiGQsJh4fGtP1xrhAoUvcTsqi3uCGg',
      blockHeight: 2708,
    },
    continuation: {
      executed: null,
      pactId: 'zflBHR6QJBR78rdiOu6Hr-zCwDTOEOeBamsjtUX94Zk',
      stepHasRollback: false,
      step: 0,
      yield: {
        data: {
          amount: 0.01,
          receiver:
            '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
          'source-chain': '0',
          'receiver-guard': {
            pred: 'keys-all',
            keys: [
              '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
            ],
          },
        },
        source: '0',
        provenance: {
          targetChainId: '1',
          moduleHash: 'rE7DU8jlQL9x_MPYuniZJf5ICBTAEHAIFQCB4blofP4',
        },
      },
      continuation: {
        args: [
          '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
          '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
          {
            pred: 'keys-all',
            keys: [
              '4f9c46df2fe874d7c1b60f68f8440a444dd716e6b2efba8ee141afdd58c993dc',
            ],
          },
          '1',
          0.01,
        ],
        def: 'coin.transfer-crosschain',
      },
      stepCount: 2,
    },
    txId: 3290,
  },
};

export const testSPVRequest: ISPVRequestBody = {
  requestKey: 'zflBHR6QJBR78rdiOu6Hr-zCwDTOEOeBamsjtUX94Zk',
  targetChainId: '1',
};

export const testSPVProof: SPVResponse =
  'eyJjaGFpbiI6MSwib2JqZWN0IjoiQUFBQUVBQUFBQUFBQUFBQkFBY3UzZlNTWXJpRV9ndEFybzFRN1NPMEZ2RDNaeFhUeGNWdzhDMHdkYXJfQU94TjZPRjFIdVZhY3dHUGVBY3dJZkpHZWoyUnNNTkhEdmlrZ2NZUWVockVBZWhPUk94V0FyQmJ1emV2dktNR1BlMHVGVV9QTzJ6MzdULS1jS2F0NnV3ekFYMGs1N1diOGJrT1JCUGhERHI4eXFiWG9YU2dJLWdaaEFMYlBUYTU0WWVDQUg4Ukgtc1dZV0dRU2xLdkNoYWlLeGZ6SGo0RkhCZnRRNXpSdkU3VmlOUWlBWGlVSk02SzNSZ3VjRkp6dGRCbS1QRlFZb0lYTzdCVXEyUjY5ZFBjZTR2ZUFIWnJicnIwc24tbkp3N1E2ZGxfSDdRVW1aNXM5QjMwZlQtYkdjbzB0RmF2QVBMVGxwUmh0bmVTd1FMeU0zdmhUc0NmQU9sb01ndGN1ci1OMFl5d0NCcG9BVlVxZHpZQ2ladTVDTUhKYjBWRGFqZGUtaUNTNXI1OVIzZlM1QTdWcHhxeUFMblpWWTU4cllFdjd4WXphM0hRTXBjQlRmUjU0aHZGREZINS1CUXlsa25jQVluUzBvYUhMVlFqamRJTFZpZXMtOUJZZ1lHb0dTZk1VUTZoTW5mWlZVdlZBT21HYnVULUx3UkxhTHhxY3FxVWRhbFMzVXpUbW00bHZlcXY4a1V3Szl2NUFJZHRQU2ZkZG9fTVJGUmpURGlxeTdOb1dCaVliNWhNNFpDNEs0b1A5aWVMQWZzYmY0ZFJqeHdyS0Nudm95YW5aUHFzWnJGdXgxZFBadWlDOTNTbUZYZFBBQ1VsYjJwal9KUmdQdnpmbzdiQXlDTmlIUnEzOHBGUlktOG8yNGxtdzVZOUFBS0VTcmpKVzJYM2JCWnU4dkl0NGI2WGNSLURwbzIzSE54S1N3bjBWMVotIiwic3ViamVjdCI6eyJpbnB1dCI6IkFCUjdJbWRoY3lJNk5EUTBMQ0p5WlhOMWJIUWlPbnNpYzNSaGRIVnpJam9pYzNWalkyVnpjeUlzSW1SaGRHRWlPbnNpWVcxdmRXNTBJam94TGpCbExUSXNJbkpsWTJWcGRtVnlJam9pTkdZNVl6UTJaR1l5Wm1VNE56UmtOMk14WWpZd1pqWTRaamcwTkRCaE5EUTBaR1EzTVRabE5tSXlaV1ppWVRobFpURTBNV0ZtWkdRMU9HTTVPVE5rWXlJc0luTnZkWEpqWlMxamFHRnBiaUk2SWpBaUxDSnlaV05sYVhabGNpMW5kV0Z5WkNJNmV5SndjbVZrSWpvaWEyVjVjeTFoYkd3aUxDSnJaWGx6SWpwYklqUm1PV00wTm1SbU1tWmxPRGMwWkRkak1XSTJNR1kyT0dZNE5EUXdZVFEwTkdSa056RTJaVFppTW1WbVltRTRaV1V4TkRGaFptUmtOVGhqT1RrelpHTWlYWDE5ZlN3aWNtVnhTMlY1SWpvaWVtWnNRa2hTTmxGS1FsSTNPSEprYVU5MU5raHlMWHBEZDBSVVQwVlBaVUpoYlhOcWRGVllPVFJhYXlJc0lteHZaM01pT2lKYU9YVnFkbVJEVEVsMVlXbHNUSEl5ZVRsSE0wVlRZVjg1TlVWeU1XMVdOblYwVVZaMVYyaFZWWFl3SWl3aVpYWmxiblJ6SWpwYmV5SndZWEpoYlhNaU9sc2lOR1k1WXpRMlpHWXlabVU0TnpSa04yTXhZall3WmpZNFpqZzBOREJoTkRRMFpHUTNNVFpsTm1JeVpXWmlZVGhsWlRFME1XRm1aR1ExT0dNNU9UTmtZeUlzSW1zNlpqZzVaV1kwTmpreU4yWTFNRFpqTnpCaU5tRTFPR1prTXpJeU5EVXdZVGt6TmpNeE1XUmpObUZqT1RGbU5HVmpNMlE0WldZNU5EazJNRGhrWW1ZeFppSXNOQzQwTkdVdE0xMHNJbTVoYldVaU9pSlVVa0ZPVTBaRlVpSXNJbTF2WkhWc1pTSTZleUp1WVcxbGMzQmhZMlVpT201MWJHd3NJbTVoYldVaU9pSmpiMmx1SW4wc0ltMXZaSFZzWlVoaGMyZ2lPaUp5UlRkRVZUaHFiRkZNT1hoZlRWQlpkVzVwV2twbU5VbERRbFJCUlVoQlNVWlJRMEkwWW14dlpsQTBJbjBzZXlKd1lYSmhiWE1pT2xzaU5HWTVZelEyWkdZeVptVTROelJrTjJNeFlqWXdaalk0WmpnME5EQmhORFEwWkdRM01UWmxObUl5WldaaVlUaGxaVEUwTVdGbVpHUTFPR001T1ROa1l5SXNJalJtT1dNME5tUm1NbVpsT0RjMFpEZGpNV0kyTUdZMk9HWTRORFF3WVRRME5HUmtOekUyWlRaaU1tVm1ZbUU0WldVeE5ERmhabVJrTlRoak9Ua3paR01pTERFdU1HVXRNaXdpTVNKZExDSnVZVzFsSWpvaVZGSkJUbE5HUlZKZldFTklRVWxPSWl3aWJXOWtkV3hsSWpwN0ltNWhiV1Z6Y0dGalpTSTZiblZzYkN3aWJtRnRaU0k2SW1OdmFXNGlmU3dpYlc5a2RXeGxTR0Z6YUNJNkluSkZOMFJWT0dwc1VVdzVlRjlOVUZsMWJtbGFTbVkxU1VOQ1ZFRkZTRUZKUmxGRFFqUmliRzltVURRaWZTeDdJbkJoY21GdGN5STZXeUkwWmpsak5EWmtaakptWlRnM05HUTNZekZpTmpCbU5qaG1PRFEwTUdFME5EUmtaRGN4Tm1VMllqSmxabUpoT0dWbE1UUXhZV1prWkRVNFl6azVNMlJqSWl3aUlpd3hMakJsTFRKZExDSnVZVzFsSWpvaVZGSkJUbE5HUlZJaUxDSnRiMlIxYkdVaU9uc2libUZ0WlhOd1lXTmxJanB1ZFd4c0xDSnVZVzFsSWpvaVkyOXBiaUo5TENKdGIyUjFiR1ZJWVhOb0lqb2lja1UzUkZVNGFteFJURGw0WDAxUVdYVnVhVnBLWmpWSlEwSlVRVVZJUVVsR1VVTkNOR0pzYjJaUU5DSjlMSHNpY0dGeVlXMXpJanBiSWpFaUxDSmpiMmx1TG5SeVlXNXpabVZ5TFdOeWIzTnpZMmhoYVc0aUxGc2lOR1k1WXpRMlpHWXlabVU0TnpSa04yTXhZall3WmpZNFpqZzBOREJoTkRRMFpHUTNNVFpsTm1JeVpXWmlZVGhsWlRFME1XRm1aR1ExT0dNNU9UTmtZeUlzSWpSbU9XTTBObVJtTW1abE9EYzBaRGRqTVdJMk1HWTJPR1k0TkRRd1lUUTBOR1JrTnpFMlpUWmlNbVZtWW1FNFpXVXhOREZoWm1Sa05UaGpPVGt6WkdNaUxIc2ljSEpsWkNJNkltdGxlWE10WVd4c0lpd2lhMlY1Y3lJNld5STBaamxqTkRaa1pqSm1aVGczTkdRM1l6RmlOakJtTmpobU9EUTBNR0UwTkRSa1pEY3hObVUyWWpKbFptSmhPR1ZsTVRReFlXWmtaRFU0WXprNU0yUmpJbDE5TENJeElpd3hMakJsTFRKZFhTd2libUZ0WlNJNklsaGZXVWxGVEVRaUxDSnRiMlIxYkdVaU9uc2libUZ0WlhOd1lXTmxJanB1ZFd4c0xDSnVZVzFsSWpvaWNHRmpkQ0o5TENKdGIyUjFiR1ZJWVhOb0lqb2lja1UzUkZVNGFteFJURGw0WDAxUVdYVnVhVnBLWmpWSlEwSlVRVVZJUVVsR1VVTkNOR0pzYjJaUU5DSjlYU3dpYldWMFlVUmhkR0VpT201MWJHd3NJbU52Ym5ScGJuVmhkR2x2YmlJNmV5SmxlR1ZqZFhSbFpDSTZiblZzYkN3aWNHRmpkRWxrSWpvaWVtWnNRa2hTTmxGS1FsSTNPSEprYVU5MU5raHlMWHBEZDBSVVQwVlBaVUpoYlhOcWRGVllPVFJhYXlJc0luTjBaWEJJWVhOU2IyeHNZbUZqYXlJNlptRnNjMlVzSW5OMFpYQWlPakFzSW5scFpXeGtJanA3SW1SaGRHRWlPbnNpWVcxdmRXNTBJam94TGpCbExUSXNJbkpsWTJWcGRtVnlJam9pTkdZNVl6UTJaR1l5Wm1VNE56UmtOMk14WWpZd1pqWTRaamcwTkRCaE5EUTBaR1EzTVRabE5tSXlaV1ppWVRobFpURTBNV0ZtWkdRMU9HTTVPVE5rWXlJc0luTnZkWEpqWlMxamFHRnBiaUk2SWpBaUxDSnlaV05sYVhabGNpMW5kV0Z5WkNJNmV5SndjbVZrSWpvaWEyVjVjeTFoYkd3aUxDSnJaWGx6SWpwYklqUm1PV00wTm1SbU1tWmxPRGMwWkRkak1XSTJNR1kyT0dZNE5EUXdZVFEwTkdSa056RTJaVFppTW1WbVltRTRaV1V4TkRGaFptUmtOVGhqT1RrelpHTWlYWDE5TENKemIzVnlZMlVpT2lJd0lpd2ljSEp2ZG1WdVlXNWpaU0k2ZXlKMFlYSm5aWFJEYUdGcGJrbGtJam9pTVNJc0ltMXZaSFZzWlVoaGMyZ2lPaUp5UlRkRVZUaHFiRkZNT1hoZlRWQlpkVzVwV2twbU5VbERRbFJCUlVoQlNVWlJRMEkwWW14dlpsQTBJbjE5TENKamIyNTBhVzUxWVhScGIyNGlPbnNpWVhKbmN5STZXeUkwWmpsak5EWmtaakptWlRnM05HUTNZekZpTmpCbU5qaG1PRFEwTUdFME5EUmtaRGN4Tm1VMllqSmxabUpoT0dWbE1UUXhZV1prWkRVNFl6azVNMlJqSWl3aU5HWTVZelEyWkdZeVptVTROelJrTjJNeFlqWXdaalk0WmpnME5EQmhORFEwWkdRM01UWmxObUl5WldaaVlUaGxaVEUwTVdGbVpHUTFPR001T1ROa1l5SXNleUp3Y21Wa0lqb2lhMlY1Y3kxaGJHd2lMQ0pyWlhseklqcGJJalJtT1dNME5tUm1NbVpsT0RjMFpEZGpNV0kyTUdZMk9HWTRORFF3WVRRME5HUmtOekUyWlRaaU1tVm1ZbUU0WldVeE5ERmhabVJrTlRoak9Ua3paR01pWFgwc0lqRWlMREV1TUdVdE1sMHNJbVJsWmlJNkltTnZhVzR1ZEhKaGJuTm1aWEl0WTNKdmMzTmphR0ZwYmlKOUxDSnpkR1Z3UTI5MWJuUWlPako5TENKMGVFbGtJam96TWprd2ZRIn0sImFsZ29yaXRobSI6IlNIQTUxMnRfMjU2In0';
