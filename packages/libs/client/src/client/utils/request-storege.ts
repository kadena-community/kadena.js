// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getRequestStorage = (initial?: Map<string, string>) => {
  const storage = new Map<string, string>(initial);

  return {
    add: (hostUrl: string, requestKeys: string[]) => {
      requestKeys.forEach((requestKey) => {
        storage.set(requestKey, hostUrl);
      });
    },
    remove: (requestKeys: string[]) => {
      requestKeys.forEach((requestKey) => {
        storage.delete(requestKey);
      });
    },
    groupByHost: () => {
      const byHost = new Map<string, string[]>();
      storage.forEach((url, requestKey) => {
        const prev = byHost.get(url) ?? [];
        byHost.set(url, [...prev, requestKey]);
      });
      return [...byHost.entries()];
    },
    getByHost: (hostUrl: string) => {
      const list: string[] = [];
      storage.forEach((url, requestKey) => {
        if (url === hostUrl) {
          list.push(requestKey);
        }
      });
      return list;
    },
    get: (requestKey: string) => storage.get(requestKey),
  };
};
