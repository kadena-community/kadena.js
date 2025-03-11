export const raceGuard = () => {
  let lastPromise: Promise<unknown>;
  return <T>(promise: Promise<T>) => {
    lastPromise = promise;
    return new Promise<T>((resolve, reject) => {
      promise
        .then((result) => {
          if (lastPromise === promise) {
            resolve(result);
          }
        })
        .catch((error) => {
          if (lastPromise === promise) {
            reject(error);
          }
        });
    });
  };
};

export const withRaceGuard = <T extends (...args: any[]) => Promise<any>>(
  cb: T,
) => {
  const guard = raceGuard();
  return (...args: Parameters<T>): ReturnType<T> => {
    return guard(cb(...args) as ReturnType<T>) as ReturnType<T>;
  };
};
