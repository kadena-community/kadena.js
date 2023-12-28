import { expect, test } from '@playwright/test';
import dirTree from 'directory-tree';
import fs from 'fs';
import { join } from 'path';
import type { Metadata } from './helpers';
import { extractMetadataFromMarkdown } from './helpers';

test('Kadena Menu should list all markdown files.', async ({ page }) => {
  await test.step('Open Tools and navigate to Faucet', async () => {
    await page.goto('/kadena/');

    //Open all menu's
    const collapsedFirstLevelElements = await page
      .locator('[data-cy="sidemenu-submenu"] [test-id="menuItem-1"] > button')
      .all();
    for (const collapsedElement of collapsedFirstLevelElements) {
      await collapsedElement.click();
    }
    const collapsedSecondLevelElements = await page
    .locator('[data-cy="sidemenu-submenu"] [test-id="menuItem-2"] > button')
    .all();
    for (const collapsedElement of collapsedSecondLevelElements) {
      await collapsedElement.click();
    }


    const directory = join(__dirname, '../pages/kadena/');
    const expectedTree = await dirTree(directory, {
      extensions: /\.md/,
      exclude: [/index.md/, /api/],
    });
    if (expectedTree.children) {
      for (const menuItem of expectedTree.children) {
        // Validate presence of menu items without children
        if (!menuItem.children) {
          const file = fs.readFileSync(menuItem.path);
          const childMetaData: Metadata = extractMetadataFromMarkdown(file);
          expect(
            page.locator(
              `[data-cy="sidemenu-submenu"] [test-id="menuItem-1"] > a:text("${childMetaData.label}")`,
            ),
            `Expected ${childMetaData.label} to be visible on level 1 in the menu.`,
          ).toBeVisible();
        } else {
          // validate presence of first level children
          for (const firstChild of menuItem.children) {
            if (!firstChild.children) {
              const indexFile = fs.readFileSync(`${menuItem.path}/index.md`);
              const indexMetaData: Metadata =
                extractMetadataFromMarkdown(indexFile);

              const childFile = fs.readFileSync(firstChild.path);
              const childMetaData: Metadata =
                extractMetadataFromMarkdown(childFile);
              expect(
                page.locator(
                  `[data-cy="sidemenu-submenu"] [test-id="menuItem-1"] > button:text("${indexMetaData.menu}") + ul [test-id="menuItem-2"] > a:text("${childMetaData.label}")`,
                ),
                `Expected ${childMetaData.label} to be visible on level 2 in the menu.`,
              ).toBeVisible();
            }
            else {
              // validate presence of second level children
              for (const secondChild of firstChild.children) {

                const menuIndexFile = fs.readFileSync(`${menuItem.path}/index.md`);
                const menuIndexMetaData: Metadata =
                  extractMetadataFromMarkdown(menuIndexFile);


                const firstChildIndexFile = fs.readFileSync(`${firstChild.path}/index.md`);
                const firstChildIndexMetaData: Metadata =
                  extractMetadataFromMarkdown(firstChildIndexFile);


                const secondChildFile = fs.readFileSync(secondChild.path);
                const secondChildMetaData: Metadata =
                  extractMetadataFromMarkdown(secondChildFile);
                  expect(
                    page.locator(
                      `[data-cy="sidemenu-submenu"] [test-id="menuItem-1"] > button:text("${menuIndexMetaData.menu}") + ul [test-id="menuItem-2"] > button:text("${firstChildIndexMetaData.menu}") + ul [test-id="menuItem-3"] > a:text("${secondChildMetaData.label}")`,
                    ),
                    `Expected ${secondChildMetaData.label} to be visible on level 3 in the menu.`,
                  ).toBeVisible();
              }
              // playwright.$('[data-cy="sidemenu-submenu"] [test-id="menuItem-1"] > button:text("Kadena Wallets") + ul [test-id="menuItem-2"] >  button:text("Chainweaver") + ul [test-id="menuItem-3"] a:text("User Guide")')
            }
          }
        }
      }
    }

    // console.log(expectedTree.children[0].children)
    // for (child of expectedTree.children[]) {

    // }

    const foundMenuItemsCount = await page
      .locator('[data-cy="sidemenu-submenu"] [test-id="menuItem-1"]')
      .count();

    //expect(expectedMenuItemCount).toEqual(foundMenuItemsCount)

    // for (const parentItem of parentItems) {
    //   // console.log('parentItem');
    //   // console.log(await parentItem.textContent());
    //   const childItems = await parentItem
    //     .locator('+ ul [test-id="menuItem-2"]')
    //     .all();

    //   if (childItems) {
    //     const foundChildrenTree: { name: string | null }[] = [];
    //     for (const childItem of childItems) {
    //       foundChildrenTree.push({ name: await childItem.textContent() });
    //     }
    //     foundTree.push({
    //       name: await parentItem.textContent(),
    //       children: foundChildrenTree,
    //     });
    //     continue;
    //   }
    //   foundTree.push({
    //     name: await parentItem.textContent(),
    //     children: [],
    //   });
    // }
    // console.log(expectedTree.children[0].children)
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
