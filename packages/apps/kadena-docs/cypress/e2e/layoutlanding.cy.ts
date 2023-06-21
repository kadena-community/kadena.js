describe('landing page layout', () => {
  const menu = () => cy.get('[data-cy="menu"]');
  const header = () => cy.get('[data-cy="titleheader"]');
  beforeEach(() => {
    cy.visit('/docs/__tests/chainweb');
  });

  describe('desktop', () => {
    it('does not have an asidemenu', () => {
      cy.percySnapshot('test');
      cy.get('[data-cy="aside"]').should('not.exist');
    });

    it('shows the sidemenu', () => {
      menu().should('exist');
      menu()
        .get('[data-cy="sidemenu-submenu"]')
        .find('ul:first')
        .children()
        .should('have.length', 4);
    });

    it('shows the sidemenu with its own children', () => {
      menu().should('exist');
    });

    it('shows the title header', () => {
      menu().should('be.visible');
      header().should('be.visible');
      header().find('h1').contains('Chainweb');
      header()
        .find('h5')
        .contains(
          'The safest, most user-friendly language for smart contracts',
        );

      header().find('svg').should('exist');

      cy.get('header').first().find('nav > ul > li:last-child').click();
      header().find('h1').contains('Pact');
    });
  });
});
