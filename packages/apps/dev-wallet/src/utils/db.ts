export const createStore =
  (db: IDBDatabase) => (name: string, keyPath?: string, index?: string) => {
    if (!db.objectStoreNames.contains(name)) {
      const store = db.createObjectStore(
        name,
        keyPath ? { keyPath } : undefined,
      );
      if (index) {
        store.createIndex(index, index);
      }
    }
  };

export const connect = (name: string, version: number) => {
  if (version < 1 || !Number.isInteger(version)) {
    throw new Error('INVALID_INTEGER: must be a positive integer');
  }
  return new Promise<{ db: IDBDatabase; needsUpgrade: boolean }>(
    (resolve, reject) => {
      const request = indexedDB.open(name, 1);
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        const db = request.result;
        resolve({ db, needsUpgrade: false });
      };
      request.onupgradeneeded = async () => {
        const db = request.result;
        resolve({ db, needsUpgrade: true });
      };
    },
  );
};

export const getAllItems =
  (db: IDBDatabase) =>
  <T>(storeName: string, index?: string) => {
    return new Promise<T[]>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      let request: IDBRequest<any>;
      if (index) {
        const idx = store.index(index);
        request = idx.getAll();
      } else {
        request = store.getAll();
      }
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  };

export const getOneItem =
  (db: IDBDatabase) =>
  <T>(storeName: string, key: string) => {
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  };

export const addItem =
  (db: IDBDatabase) =>
  <T>(storeName: string, value: T, key?: string) => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(value, key);
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  };

const isExist = async <T>(
  db: IDBDatabase,
  storeName: string,
  value: T,
  key?: string,
) => {
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const isDataExist = await getOneItem(db)(
    storeName,
    key ?? (value as any)[store.keyPath! as string],
  )
    .then(() => true)
    .catch(() => false);
  return isDataExist;
};

export const updateItem =
  (db: IDBDatabase) =>
  <T>(storeName: string, value: T, key?: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const isDataExist = isExist(db, storeName, value, key);
      if (!isDataExist) {
        reject(
          new Error(
            'DATA_NOT_EXIST: you cannot update data that does not exist, use addItem instead',
          ),
        );
      }
      const request = store.put(value, key);
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  };
