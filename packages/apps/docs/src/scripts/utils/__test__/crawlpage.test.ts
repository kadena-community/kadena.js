import { loadConfigPages } from '@/scripts/fixLocalLinks/utils/loadConfigPages.mock';
import { crawlPage } from '../crawlPage';

describe('utils crawlPage', () => {
  it('should crawl all the pages and call the function every time with correct props', async () => {
    const pages = await loadConfigPages();
    const mock = vi.fn().mockImplementation(() => {});

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      await crawlPage(page, [], mock);
    }

    expect(mock).toHaveBeenCalledTimes(15);
  });
});
