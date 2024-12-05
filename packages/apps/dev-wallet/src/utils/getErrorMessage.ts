export const getErrorMessage = (e: any, fallback: string = 'UNKNOWN ERROR') => {
  const message = 'message' in e ? e.message : JSON.stringify(e);
  if (message) {
    return typeof message === 'string' ? message : JSON.stringify(message);
  }
  return fallback;
};
