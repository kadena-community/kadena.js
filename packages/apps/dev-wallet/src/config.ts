const colorList = [
  '#2898bd',
  '#5e4db2',
  '#e56910',
  '#943d73',
  '#09326c',
  '#8f7ee7',
  '#50253f',
  '#a54800',
];
export const config = {
  colorList,
  defaultAccentColor: colorList[0],
  DB: {
    DB_VERSION: 43,
    DB_NAME: 'dev-wallet',
  },
  ACCOUNTS: {
    SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  },
  SESSION: {
    TTL: 30 * 60 * 1000, // 30 minutes
  },
  BACKUP: {
    BACKUP_INTERVAL: 1000 * 60 * 60 * 12, // 12 hours
  },
};
