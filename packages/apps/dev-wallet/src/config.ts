const colorList = ['#42CEA4', '#42BDCE', '#4269CE', '#B242CE', '#CEA742'];
export const config = {
  colorList,
  defaultAccentColor: colorList[0],
  DB: {
    DB_VERSION: 37,
    DB_NAME: 'dev-wallet',
    // This should be used carefully, as it will wipe the database on version change
    // I have added this for development purposes, We should remove this and write
    // a migration script
    DB_WIPE_ON_VERSION_CHANGE: true,
  },
};
