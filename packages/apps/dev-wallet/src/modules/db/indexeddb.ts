export const createStore =
  (db: IDBDatabase) =>
  (
    name: string,
    keyPath?: string,
    indexes?: Array<{
      index: string;
      indexKeyPath?: string | string[];
      unique?: boolean;
    }>,
  ) => {
    if (!db.objectStoreNames.contains(name)) {
      const store = db.createObjectStore(
        name,
        keyPath ? { keyPath } : undefined,
      );
      if (indexes) {
        indexes.forEach(({ index, indexKeyPath, unique }) => {
          store.createIndex(index, indexKeyPath ?? index, { unique });
        });
      }
    }
  };

export const connect = (name: string, version: number) => {
  if (version < 1 || !Number.isInteger(version)) {
    throw new Error('INVALID_INTEGER: must be a positive integer');
  }
  let fulfilled = false;
  return new Promise<{ db: IDBDatabase; needsUpgrade: boolean }>(
    (resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onerror = () => {
        if (fulfilled) return;
        fulfilled = true;
        reject(request.error);
      };
      request.onsuccess = () => {
        if (fulfilled) return;
        fulfilled = true;
        const db = request.result;
        resolve({ db, needsUpgrade: false });
      };
      request.onupgradeneeded = async () => {
        if (fulfilled) return;
        fulfilled = true;
        const db = request.result;
        resolve({ db, needsUpgrade: true });
      };
    },
  );
};

export const deleteDatabase = (name: string) => {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onerror = () => {
      reject(request.error);
    };
    request.onblocked = () => {
      console.warn('close all connections to the database first');
    };
    request.onsuccess = async () => {
      resolve();
    };
  });
};

export const getAllItems =
  (db: IDBDatabase) =>
  <T>(
    storeName: string,
    filter?: string[] | string | IDBKeyRange,
    indexName?: string,
  ) => {
    return new Promise<T[]>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      let request: IDBRequest;
      if (indexName) {
        const idx = store.index(indexName);
        request = idx.getAll(filter);
      } else {
        request = store.getAll(filter);
      }
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve(request.result ?? []);
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

export const deleteItem =
  (db: IDBDatabase) => (storeName: string, key: string) => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  };

const isExist =
  (db: IDBDatabase) =>
  async <T>(storeName: string, value: T, key?: string) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const isDataExist = await getOneItem(db)(
      storeName,
      key ?? (value[store.keyPath! as keyof T] as string),
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
      const isDataExist = isExist(db)(storeName, value, key);
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
