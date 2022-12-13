/* ************************************************************************** */
/* Pageing Tools */

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
    limit: number,
  ) => Promise<{ next: string | undefined; limit: number; items: T[] }>,
  n: number,
): AsyncGenerator<T[], void, unknown> {
  let next: string | undefined;
  let c = 0;
  do {
    const limit = n ? n - c : 0;
    const page = await query(next, limit);
    next = page.next;
    c += page.limit;
    yield page.items;
  } while (next && (n ? c < n : true));
}
