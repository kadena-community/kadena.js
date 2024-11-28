export const getErrorMessage = (e: any) => {
  const message = 'message' in e ? e.message : JSON.stringify(e);
  if (message) {
    return typeof message === 'string' ? message : JSON.stringify(message);
  }
  return 'Unknown error';
};
