import { LedgerTransport, StatusCodes } from 'ledger-transport-hid';
import { KADENA_PATH, LEDGER_VENDOR_ID } from './constants';
import { TransactionParams, createTransaction } from './transaction';
import { arrayBufferToHex, concatUint8Array, convertDecimal } from './utils';

const NOT_SUPPORTED_ERROR =
  'Your browser does not support connecting to hardware devices.';

export class KadenaLedger {
  transport: LedgerTransport;

  constructor(device: HIDDevice) {
    if (!KadenaLedger.isSupported()) {
      throw new Error(NOT_SUPPORTED_ERROR);
    }

    this.transport = new LedgerTransport(device);
  }

  async openApp() {
    await this.transport.send(
      0xe0,
      0xd8,
      0x00,
      0x00,
      new TextEncoder().encode('Kadena'),
      [StatusCodes.OK, 0x6e01], // 0x6e01 = already open
    );
    // Opening the app makes the device reconnect, wait a moment for this
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async getVersion(): Promise<{
    major: number;
    minor: number;
    patch: number;
    appName: string;
  }> {
    const response = await this.transport.send(
      0x00,
      0x00,
      0x00,
      0x00,
      new Uint8Array(230),
      [StatusCodes.OK, 0x6e01], // 0x6e01 = already open
    );

    // App was not open, try to open it and try again
    if (response.code === 0x6e01) {
      await this.openApp();
      return this.getVersion();
    }

    const [major, minor, patch, ...appName] = response.data;
    return {
      major,
      minor,
      patch,
      appName: new TextDecoder().decode(new Uint8Array(appName)),
    };
  }

  private derivationPath(index: number) {
    const path = KADENA_PATH.replace('{index}', index.toString()).split('/');

    const derivationPath = path.reduce((acc, curr) => {
      const hardened = curr.endsWith("'");
      const value = parseInt(curr, 10);
      if (!isNaN(value))
        return acc.concat(hardened ? 0x80000000 + value : value);
      return acc;
    }, [] as number[]);

    const data = new DataView(new ArrayBuffer(1 + derivationPath.length * 4));
    data.setUint8(0, derivationPath.length);
    for (let i = 0; i < derivationPath.length; i++) {
      data.setUint32(1 + i * 4, derivationPath[i], true);
    }
    return data.buffer;
  }

  async getPublicKey(index: number, prompt: boolean = false): Promise<string> {
    const response = await this.transport.send(
      0x00,
      prompt ? 0x01 : 0x02,
      0x00,
      0x00,
      this.derivationPath(index),
      // status 0x6e01 means app is not open
      [StatusCodes.OK, 0x6e01],
    );

    // App was not open, try to open it and try again
    if (response.code === 0x6e01) {
      await this.openApp();
      return this.getPublicKey(index, prompt);
    }

    return arrayBufferToHex(response.data.slice(1));
  }

  async signTransaction(
    index: number,
    type: 'transfer' | 'cross-chain-transfer',
    params: TransactionParams,
  ) {
    const textEncode = (text: string) => {
      const encoder = new TextEncoder();
      const buffer = encoder.encode(text);
      return new Uint8Array([buffer.byteLength, ...buffer]);
    };

    const payload = concatUint8Array(
      this.derivationPath(index),
      new Uint8Array([type === 'transfer' ? 0x01 : 0x02]),
      textEncode(params.recipient),
      textEncode(params.recipientChainId),
      textEncode(params.networkId),
      textEncode(convertDecimal(params.amount)),
      textEncode(params.namespace_),
      textEncode(params.module_),
      textEncode(params.gasPrice),
      textEncode(params.gasLimit),
      textEncode(params.creationTime),
      textEncode(params.chainId),
      textEncode(params.nonce),
      textEncode(params.ttl),
    );
    const response = await this.transport.send(0x00, 0x10, 0x00, 0x00, payload);
    const sig = arrayBufferToHex(response.data.slice(0, 64));
    const pubKey = arrayBufferToHex(response.data.slice(64, 96));
    const { cmd, hash } = createTransaction(params, pubKey);
    return {
      pubKey,
      command: {
        cmd,
        hash,
        sigs: [{ sig: sig }],
      },
    };
  }

  static async findDevice() {
    if (!KadenaLedger.isSupported()) {
      throw new Error(NOT_SUPPORTED_ERROR);
    }
    try {
      let devices = await navigator.hid.getDevices();
      const exists = devices.find((d) => d.vendorId === LEDGER_VENDOR_ID);
      if (exists) {
        return new KadenaLedger(exists);
      }
      const [ledger] = await navigator.hid.requestDevice({
        filters: [{ vendorId: LEDGER_VENDOR_ID }],
      });
      return new KadenaLedger(ledger);
    } catch (error) {
      throw new Error('Failed to find and pair with ledger device');
    }
  }

  static isSupported() {
    return 'hid' in navigator;
  }
}
