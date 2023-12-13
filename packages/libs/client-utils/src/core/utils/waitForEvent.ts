/**
 * @alpha
 */
export function waitForEvent<
  T extends {
    on: (name: any, data: any) => any;
    execute: () => Promise<any>;
  },
>(event: string, task: T) {
  return new Promise<any>((resolve, reject) => {
    task.on(event, (data: any) => {
      resolve(data);
    });
    task.execute().catch((e) => {
      reject(e);
    });
  });
}
