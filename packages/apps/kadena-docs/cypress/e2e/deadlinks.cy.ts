import { menuData } from '../../src/data//menu.js';

const checkForInternalLink = (url) => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return false;
  }
  return true;
};

const missingInternalLinks: string[] = [];
const getTests = (item) => {
  describe(`deadlinks: ${item.root}`, () => {
    beforeEach(() => {
      cy.visit(item.root);
    });

    it('checks deadlinks', () => {
      cy.get('#maincontent > article a').each((link, idx) => {
        const url = link[0].getAttribute('href');
        if (checkForInternalLink(url))
          cy.request({
            method: 'GET',
            url,
            failOnStatusCode: false,
          }).then((response) => {
            if (response.status >= 400) {
              missingInternalLinks.push({
                type: 'link',
                url,
              });
            }
          });
      });
    });
  });

  item.children.map(getTests);
};

describe(`deadlinks`, () => {
  menuData.map(getTests);

  it('errors on missing internal links', () => {
    if (missingInternalLinks.length) {
      const showMissingLinks = (arr) =>
        arr.map(({ type, url }) => `${type}: ${url}\n`);

      cy.contains(
        `some internal links are not working: \n${showMissingLinks(
          missingInternalLinks,
        )}`,
      ).should('exist');
    }
  });
});

export {};
