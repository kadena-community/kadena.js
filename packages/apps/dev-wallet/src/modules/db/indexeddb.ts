const CREATION_TIME_KEY = 'creationTime';

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
  return new Promise<
    | {
        db: IDBDatabase;
        needsUpgrade: false;
      }
    | {
        db: IDBDatabase;
        needsUpgrade: true;
        oldVersion: number;
        versionTransaction: IDBTransaction;
      }
  >((resolve, reject) => {
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
    request.onupgradeneeded = async (event) => {
      if (fulfilled) return;
      fulfilled = true;
      const db = request.result;
      const versionTransaction: IDBTransaction | undefined = (
        event?.target as any
      )?.transaction;
      if (!versionTransaction) {
        reject(new Error('No transaction found'));
        return;
      }
      resolve({
        db,
        needsUpgrade: true,
        oldVersion: event.oldVersion,
        versionTransaction,
      });
    };
  });
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

const sortByCreationDate = <T>(a: T, b: T) => {
  if (
    a &&
    b &&
    typeof a === 'object' &&
    typeof b === 'object' &&
    CREATION_TIME_KEY in a &&
    CREATION_TIME_KEY in b &&
    typeof a[CREATION_TIME_KEY] === 'number' &&
    typeof b[CREATION_TIME_KEY] === 'number'
  )
    return b[CREATION_TIME_KEY] - a[CREATION_TIME_KEY];
  return 0;
};

export const getAllItems =
  (db: IDBDatabase, versionTransaction?: IDBTransaction) =>
  <T>(
    storeName: string,
    filter?: string[] | string | IDBKeyRange,
    indexName?: string,
  ) => {
    return new Promise<T[]>((resolve, reject) => {
      const transaction =
        versionTransaction || db.transaction(storeName, 'readonly');
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
        const result = request.result ?? [];
        resolve(result.sort(sortByCreationDate));
      };
    });
  };

export const getAllKeyValues =
  (db: IDBDatabase) =>
  <T>(
    storeName: string,
    filter?: string[] | string | IDBKeyRange,
    indexName?: string,
  ) => {
    return new Promise<{ key: IDBValidKey; value: T }[]>((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      let request: IDBRequest<IDBCursorWithValue | null>;
      const result: { key: IDBValidKey; value: T }[] = [];
      if (indexName) {
        const idx = store.index(indexName);
        request = idx.openCursor(filter);
      } else {
        request = store.openCursor(filter);
      }
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = (event) => {
        if (!event.target) return;
        const cursor: IDBCursorWithValue | null = (event.target as any).result;

        if (cursor) {
          // Push key and value to the result array
          result.push({ key: cursor.key, value: cursor.value });

          // Continue to the next record
          cursor.continue();
        } else {
          // Finished iterating over all records
          resolve(result);
        }
      };
    });
  };

export const getOneItem =
  (db: IDBDatabase, transaction?: IDBTransaction) =>
  <T>(storeName: string, key: string) => {
    return new Promise<T>((resolve, reject) => {
      const tx = transaction ?? db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
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
  (db: IDBDatabase, transaction?: IDBTransaction) =>
  <T>(
    storeName: string,
    value: T,
    key?: string,
    { noCreationTime = false } = {},
  ) => {
    return new Promise<void>((resolve, reject) => {
      const tx = transaction ?? db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(
        noCreationTime ? value : { ...value, [CREATION_TIME_KEY]: Date.now() },
        key,
      );
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
  (db: IDBDatabase, transaction?: IDBTransaction) =>
  <T>(storeName: string, value: T, key?: string) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      const tx = transaction ?? db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
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

export const getScheme = (db: IDBDatabase) => (storeName: string) => {
  const transaction = db.transaction(storeName, 'readonly');
  const objectStore = transaction.objectStore(storeName);
  const schema = {
    name: storeName,
    keyPath: objectStore.keyPath,
    autoIncrement: objectStore.autoIncrement,
    indexes: Array.from(objectStore.indexNames).map((indexName) => {
      const index = objectStore.index(indexName);
      return {
        name: index.name,
        keyPath: index.keyPath,
        unique: index.unique,
        multiEntry: index.multiEntry,
      };
    }),
  };
  return schema;
};

export const dbDump = (db: IDBDatabase) => () => {
  const tables = Array.from(db.objectStoreNames);
  const getKeyValues = getAllKeyValues(db);
  const tableScheme = getScheme(db);
  return Promise.all(
    tables.map(async (table) => ({
      [table]: await getKeyValues(table),
    })),
  )
    .then((data) => Object.assign({}, ...data))
    .then((data) => ({
      db_name: db.name,
      db_version: db.version,
      timestamp: Date.now(),
      schemes: tables.map((table) => tableScheme(table)),
      data: data,
    }));
};

export const clearStore =
  (db: IDBDatabase, transaction?: IDBTransaction) => (storeName: string) => {
    return new Promise<void>((resolve, reject) => {
      const tx = transaction ?? db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();
      request.onerror = () => {
        reject(request.error);
      };
      request.onsuccess = () => {
        resolve();
      };
    });
  };
