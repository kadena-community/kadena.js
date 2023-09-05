/* ************************************************************************** */
/* Paging Tools */

import type { IPagedResponse } from './types';

/** Yields full pages, i.e. arrarys of page items.
 *
 * @param query - A query callback that takes a `next` and an optional `limit` parameter.
 * @param n - Optional upper limit and the number of returned items.
 *
 * @alpha
 */

export async function* pageIterator<T>(
  query: (
    next: string | undefined,
    limit: number | undefined,
  ) => Promise<IPagedResponse<T>>,
  n: number | undefined,
): AsyncGenerator<T[], void, unknown> {
  let next = undefined;
  let c = 0;
  do {
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
    const limit = n ? n - c : undefined;
    const page: IPagedResponse<T> = await query(next, limit);
    next = page.next;
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
    c += page.limit || 0;
    yield page.items;
    /* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions */
  } while (next && (n ? c < n : true));
}
