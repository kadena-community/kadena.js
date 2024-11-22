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
    DB_VERSION: 38,
    DB_NAME: 'dev-wallet',
    // This should be used carefully, as it will wipe the database on version change
    // I have added this for development purposes, We should remove this and write
    // a migration script
    DB_WIPE_ON_VERSION_CHANGE: true,
  },
  ACCOUNTS: {
    SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  },
  SESSION: {
    TTL: 30 * 60 * 1000, // 30 minutes
    ENCRYPT_SESSION: false,
  },
};
