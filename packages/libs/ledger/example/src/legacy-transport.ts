import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;

import type TransportWebHID from '@ledgerhq/hw-transport-webhid';

const LEDGER_VENDOR_ID = 0x2c97;
const KADENA_PATH = "m/44'/626'/{index}'/0/0";

const connect = async () => {
  let devices = await navigator.hid.getDevices();
  let ledger = devices.find((d) => d.vendorId === LEDGER_VENDOR_ID);

  if (!ledger) {
    await navigator.hid.requestDevice({
      filters: [{ vendorId: LEDGER_VENDOR_ID }],
    });

    devices = await navigator.hid.getDevices();
    ledger = devices.find((d) => d.vendorId === LEDGER_VENDOR_ID);
  }

  if (ledger) {
    const { default: TransportWebHID } = await import(
      '@ledgerhq/hw-transport-webhid'
    );
    const transport = await TransportWebHID.open(ledger);
    return transport;
  }

  throw new Error('No transport');
};

export const openApp = async () => {
  let transport: TransportWebHID | null = null;

  try {
    transport = await connect();

    await transport.send(
      0xe0,
      0xd8,
      0x00,
      0x00,
      Buffer.from('Kadena', 'ascii'),
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    // When the app is already open, the device returns 0x6e01
    if (!error.toString().includes('0x6e01')) {
      console.error(error);
    }
  } finally {
    if (transport) {
      transport.close();
    }
  }
};
