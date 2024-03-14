import { env } from '@/utils/env';
import type { ChainId, IUnsignedCommand } from '@kadena/client';
import {
  Pact,
  createSignWithKeypair,
  isSignedTransaction,
  readKeyset,
} from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type {
  BuildTransactionResult,
  TransferCrossChainTxParams,
  TransferTxParams,
} from '@ledgerhq/hw-app-kda';
import AppKda from '@ledgerhq/hw-app-kda';
import type Transport from '@ledgerhq/hw-transport';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { isTestEnvironment } from './isDevEnvironment';
import { stripAccountPrefix } from './string';

let transport: Transport | null = null;

export const getTransport = async () => {
  if (!transport) {
    // eslint-disable-next-line require-atomic-updates
    transport = await TransportWebHID.create();

    transport.on('disconnect', () => {
      transport = null;
    });
  }
  return transport;
};

export const bufferToHex = (buffer: Uint8Array) => {
  return [...buffer]
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join('');
};

export const hexToBuffer = (hex: string) => {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return new Uint8Array(bytes);
};

export type AppKdaLike = AppKda | IKadenaLedgerAppLike;

export interface IKadenaLedgerAppLike {
  getPublicKey: AppKda['getPublicKey'];
  signTransferCrossChainTx: AppKda['signTransferCrossChainTx'];
  signTransferTx: AppKda['signTransferTx'];
  signTransferCreateTx: AppKda['signTransferCreateTx'];
  signTxInternal: AppKda['signTxInternal'];
}

class KadenaLedgerAppLike implements IKadenaLedgerAppLike {
  public async getPublicKey(path: string) {
    return {
      publicKey: hexToBuffer(
        env('QA_LEDGER_MOCKED_PUBKEY', 'ENV VAR NOT SET!'),
      ),
      address: null,
    };
  }

  public async signTransferTx(params: TransferTxParams) {
    const p1 = params as TransferCrossChainTxParams;
    p1.recipient_chainId = 0; // Ignored by Ledger App
    return await this.signTxInternal(p1, 0);
  }

  public async signTransferCreateTx(params: TransferTxParams) {
    const p1 = params as TransferCrossChainTxParams;
    p1.recipient_chainId = 0; // Ignored by Ledger App
    return await this.signTxInternal(p1, 1);
  }

  public async signTransferCrossChainTx(params: TransferCrossChainTxParams) {
    if (params.chainId === params.recipient_chainId)
      throw new TypeError(
        "Recipient chainId is same as sender's in a cross-chain transfer",
      );
    return await this.signTxInternal(params, 2);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async signTxInternal(
    params: TransferCrossChainTxParams,
    txType: 0 | 1 | 2,
  ): Promise<BuildTransactionResult> {
    const senderKey = env('QA_LEDGER_MOCKED_PUBKEY', 'ENV VAR NOT SET!');
    const sender = `k:${senderKey}`;

    const amount = new PactNumber(params.amount).toPactDecimal();

    let pactCommand: IUnsignedCommand;

    if (txType === 1) {
      pactCommand = Pact.builder
        .execution(
          Pact.modules.coin['transfer-create'](
            sender,
            params.recipient,
            readKeyset('account-guard'),
            amount,
          ),
        )
        .addKeyset(
          'account-guard',
          'keys-all',
          stripAccountPrefix(params.recipient),
        )
        .addSigner(senderKey, (signFor) => [
          signFor('coin.TRANSFER', sender, params.recipient, amount),
        ])
        .addSigner(senderKey, (signFor) => [signFor('coin.GAS')])
        .setMeta({
          senderAccount: sender,
          chainId: `${params.chainId}` as ChainId,
        })
        .setNetworkId(params.network)
        .createTransaction();
    } else if (txType === 2) {
      pactCommand = Pact.builder
        .execution(
          Pact.modules.coin.defpact['transfer-crosschain'](
            sender,
            params.recipient,
            readKeyset('account-guard'),
            `${params.recipient_chainId}`,
            amount,
          ),
        )
        .addKeyset(
          'account-guard',
          'keys-all',
          stripAccountPrefix(params.recipient),
        )
        .addSigner(senderKey, (signFor) => [
          signFor(
            'coin.TRANSFER_XCHAIN',
            sender,
            params.recipient,
            amount,
            params.recipient_chainId,
          ),
        ])
        .addSigner(senderKey, (signFor) => [signFor('coin.GAS')])
        .setMeta({
          senderAccount: sender,
          chainId: `${params.chainId}` as ChainId,
        })
        .setNetworkId(params.network)
        .createTransaction();
    } else {
      pactCommand = Pact.builder
        .execution(Pact.modules.coin.transfer(sender, params.recipient, amount))
        .addSigner(senderKey, (signFor) => [
          signFor('coin.TRANSFER', sender, params.recipient, amount),
        ])
        .addSigner(senderKey, (signFor) => [signFor('coin.GAS')])
        .setMeta({
          senderAccount: sender,
          chainId: `${params.chainId}` as ChainId,
        })
        .setNetworkId(params.network)
        .createTransaction();
    }

    console.log('pactCommand', pactCommand);

    const signWithKeyPair = createSignWithKeypair({
      publicKey: senderKey,
      secretKey: env('QA_LEDGER_MOCKED_PRIVATEKEY', 'ENV VAR NOT SET!'),
    });

    const signedTx = await signWithKeyPair(pactCommand);
    if (!isSignedTransaction(signedTx)) {
      throw new Error('Failed to sign transaction');
    }

    return {
      pubkey: senderKey,
      pact_command: signedTx,
    };
  }
}

export const getKadenaLedgerApp = async (): Promise<
  AppKda | IKadenaLedgerAppLike
> => {
  console.log('getKadenaLedgerApp', { isTestEnvironment });
  if (isTestEnvironment) {
    const app: IKadenaLedgerAppLike = new KadenaLedgerAppLike();
    return app;
  }
  const transport = await getTransport();
  const app = new AppKda(transport);
  return app;
};
