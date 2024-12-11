import { useEffect, useState } from 'react';
import { dbService } from './db.service';
import { ExtendedTableName } from './migration/createDB';

export function useSubscribe<T>(
  table: ExtendedTableName,
  uuid: string | undefined,
) {
  const [state, setState] = useState<T>();

  useEffect(() => {
    if (!uuid) return;
    let unsubscribe: () => void = () => {};
    const run = async () => {
      const dbState: T = await dbService.getOne(table, uuid);
      setState(dbState);
      unsubscribe = dbService.subscribe(table, uuid, setState);
    };
    run();
    return () => unsubscribe();
  }, [table, uuid]);

  return state;
}
