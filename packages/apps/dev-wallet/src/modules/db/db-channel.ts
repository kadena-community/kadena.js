export type EventTypes =
  | 'add'
  | 'update'
  | 'delete'
  | 'import'
  | 'migration-started'
  | 'migration-finished';

export const dbChannel = new BroadcastChannel('db-channel');
export const broadcast = (
  event: EventTypes,
  storeName?: string,
  data?: any[],
) => {
  console.log('broadcast', event, storeName, data);
  dbChannel.postMessage({ type: event, storeName, data });
};
