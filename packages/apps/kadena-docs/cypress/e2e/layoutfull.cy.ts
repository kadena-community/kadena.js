describe('full layout', () => {
  const aside = () => cy.get('[data-cy="aside"]');

  beforeEach(() => {
    cy.visit('/docs/__tests/pact/atom-sdk');
  });
  describe('desktop', () => {
    it('shows the aside menu', () => {
      aside().should('be.visible');
      aside().find('ul:first').children('li').should('have.length', 3);

      // first li child ("section 1") will not have children
      aside()
        .find('ul:first')
        .children('li')
        .first()
        .children('ul')
        .should('not.exist');

      // second li child ("section 2") will have 2 children
      aside()
        .find('ul:first > li:nth-child(2)')
        .children('ul')
        .should('exist')
        .children('li')
        .should('have.length', 2);

      // second li child ("section 2.2") will have 1 children
      aside()
        .find('ul:first > li:nth-child(2) > ul > li:nth-child(2)')
        .children('ul')
        .should('exist')
        .children('li')
        .should('have.length', 1);
    });

    it('deeplink on the page when an option of the aside menu is clicked', () => {
      cy.location().should((loc) => {
        expect(loc.hash).to.eq('');
      });
      aside().find('ul:first > li:nth-child(3) ').click();
      cy.location().should((loc) => {
        expect(loc.hash).to.eq('#section-3');
      });
    });
  });

  describe('mobile', () => {
    beforeEach(() => {
      cy.viewport(640, 720);
    });
    it('shows the aside menu', () => {
      cy.get('[data-cy="aside"]').should('not.be.visible');
    });
  });
});

export {};
