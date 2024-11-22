export function backupName(table: string, oldVersion: number) {
  return `backup:${table}_v${oldVersion}`;
}
