import type Transport from '@ledgerhq/hw-transport';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';

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
