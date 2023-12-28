import { expect, test } from '@playwright/test';
import dirTree from 'directory-tree';
import { join } from 'path';

interface Tree {
  path: string;
  name: string;
  children: [
    {
      path: string;
      name: string;
      children: [{ path: string; name: string }] | undefined;
    },
  ] | undefined;
}



test('Kadena Menu should list all markdown files.', async ({ page }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/kadena/');

    const directory = join(__dirname, '../pages/kadena/');
    const expectedTree: Tree = await dirTree(directory, {
      extensions: /\.md/,
      exclude: [/index.md/, /api/],
    });
 //   console.log(expectedTree);
    const foundTree: {
      name: string | null;
      children: { name?: string | null }[];
    }[] = [];

    const parentItems = await page
      .locator('[data-cy="sidemenu-submenu"] [test-id="menuItem-1"]')
      .all();

    for (const parentItem of parentItems) {
      // console.log('parentItem');
      // console.log(await parentItem.textContent());
      const childItems = await parentItem
        .locator('+ ul [test-id="menuItem-2"]')
        .all();

      if (childItems) {
        const foundChildrenTree: { name: string | null }[] = [];
        for (const childItem of childItems) {
          foundChildrenTree.push({ name: await childItem.textContent() });
        }
        foundTree.push({
          name: await parentItem.textContent(),
          children: foundChildrenTree,
        });
        continue;
      }
      foundTree.push({
        name: await parentItem.textContent(),
        children: [],
      });
    }
    console.log(expectedTree.children[0].children)
  });
});

// // Create an instance of the PlaywrightCrawler class - a crawler
//     // that automatically loads the URLs in headless Chrome / Playwright.
//     const crawler = new PlaywrightCrawler({
//       launchContext: {
//           // Here you can set options that are passed to the playwright .launch() function.
//           launchOptions: {
//               headless: true,
//           },
//       },

//       // Stop crawling after several pages
//       maxRequestsPerCrawl: 50,

//       // This function will be called for each URL to crawl.
//       // Here you can write the Playwright scripts you are familiar with,
//       // with the exception that browsers and pages are automatically managed by Crawlee.
//       // The function accepts a single parameter, which is an object with a lot of properties,
//       // the most important being:
//       // - request: an instance of the Request class with information such as URL and HTTP method
//       // - page: Playwright's Page object (see https://playwright.dev/docs/api/class-page)
//       async requestHandler({ request, page, enqueueLinks, log }) {
//           log.info(`Processing ${request.url}...`);

//           // A function to be evaluated by Playwright within the browser context.
//           const data = await page.$$eval('[data-cy="sidemenu-submenu"] li', ($pages) => {
//             console.log($pages)
//               const scrapedData: { title: string}[] = [];

//               // We're getting the title, rank and URL of each post on Hacker News.
//               $pages.forEach(($page) => {
//                   scrapedData.push({
//                       title: $page.querySelector('a').innerText
//                   });
//               });
//               console.log(scrapedData)
//               return scrapedData;
//           });

//           // Store the results to the default dataset.
//           await Dataset.pushData(data);

//           // // Find a link to the next page and enqueue it if it exists.
//           // const infos = await enqueueLinks({
//           //     selector: '.morelink',
//           // });

//           // if (infos.processedRequests.length === 0) log.info(`${request.url} is the last page!`);
//       },

//       // This function is called if the page processing failed more than maxRequestRetries+1 times.
//       failedRequestHandler({ request, log }) {
//           log.info(`Request ${request.url} failed too many times.`);
//       },
//   });

//   await crawler.addRequests(['http://localhost:3000/kadena/']);

//   // Run the crawler and wait for it to finish.
//   await crawler.run();

//   console.log('Crawler finished.');
