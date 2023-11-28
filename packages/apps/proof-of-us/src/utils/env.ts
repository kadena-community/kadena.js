export const env = (() => {
  const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;

  if (!TRACKING_ID) throw Error('NEXT_PUBLIC_TRACKING_ID is not set');

  return {
    TRACKING_ID,
  };
})();
