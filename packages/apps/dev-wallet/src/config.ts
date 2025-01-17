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
    DB_VERSION: 45,
    DB_NAME: 'dev-wallet',
  },
  ACCOUNTS: {
    // this need to be more intelligent; for now, we just set it to 5 seconds
    SYNC_INTERVAL: 5 * 1000, // 5 seconds
    RATE_LIMIT: 3000, // 3 second
  },
  SESSION: {
    TTL: 30 * 60 * 1000, // 30 minutes
  },
  BACKUP: {
    BACKUP_INTERVAL: 1000 * 60 * 60 * 12, // 12 hours
  },
};
