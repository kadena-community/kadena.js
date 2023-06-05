describe('full layout', () => {
  const aside = () => cy.get('[data-cy="aside"]');
  const menu = () => cy.get('[data-cy="menu"]');
  const breadcrumbs = () => cy.get('[data-cy="breadcrumbs"]');

  beforeEach(() => {
    cy.visit('/docs/__tests/pact/atom-sdk');
  });
  describe('desktop', () => {
    it('shows the breadcrumbs with icon', () => {
      breadcrumbs().find('li').should('have.length', 2);
      breadcrumbs().find('svg').should('exist');
    });
    it('shows the left sidemenu', () => {
      cy.percySnapshot('test');
      menu().should('be.visible');
      cy.get('[data-cy="hamburgermenu"]').should('not.be.visible');
    });

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
      aside().find('ul:first > li:nth-child(3) ').click(10, 10);
      cy.location().should((loc) => {
        expect(loc.hash).to.eq('#section-3');
      });
    });
  });

  describe('mobile', () => {
    const hamburgerMenu = () => cy.get('[data-cy="hamburgermenu"]');
    const secondMenu = () => menu().get('[data-cy="sidemenu-submenu"]');
    const mainMenu = () => menu().get('[data-cy="sidemenu-main"]');
    const openMenu = () => {
      hamburgerMenu().click();
    };
    beforeEach(() => {
      cy.viewport(640, 720);
    });

    it('shows the left sidemenu', () => {
      menu().should('not.be.visible');
    });

    describe('test the functionality of the sidemenu', () => {
      it('shows the aside menu', () => {
        openMenu();

        // check if everything is there
        menu().find('h5').contains('Pact');
        secondMenu().find('ul:first > li').should('have.length', 4);
        secondMenu().find('ul:first > li:nth-child(4)').contains('Atom SDK');

        secondMenu().find('li > a[data-active]').contains('Quickstart');

        secondMenu()
          .find('ul:first > li:nth-child(4) > ul')
          .should('be.visible')
          .children('li')
          .should('have.length', 2);
      });

      it('opens and closes the basics menu when clicked', () => {
        openMenu();
        const basics = () => secondMenu().find('ul:first > li:nth-child(3)');
        basics().contains('Basics');
        basics().find('ul:first').should('not.be.visible');
        basics().click();
        basics().find('ul:first').should('be.visible');
        basics()
          .find('ul:first > li > [data-active="true"]')
          .should('have.length', 0);
        basics().find('ul:first').children('li').should('have.length', 2);
        basics().find('ul:first > li:nth-child(2)').click();
        basics()
          .find('ul:first > li > [data-active="true"]')
          .should('have.length', 1)
          .first()
          .contains('Build-in Functions');
        basics()
          .find('ul:first > li > [data-active="true"] + ul > li')
          .first()
          .click();

        openMenu();
        basics().find('li > a[data-active="true"]').contains('General buildin');
        basics().find('ul:first > li > button[data-active="true"]').click();
        basics().click(10, 10);
      });

      it('shows the main menu when "Pact" backbutton is clicked', () => {
        openMenu();
        menu().find('h5').contains('Pact').click();
        menu().find('h5').contains('Kadena Docs');

        mainMenu().find('ul').children('li').should('have.length', 3);
        mainMenu().find('ul > li:nth-child(1)').contains('Pact').click();

        menu().find('h5').contains('Pact');
      });
      it('opens a new page when Chainweb is clicked in the main menu', () => {
        openMenu();
        menu().find('h5').contains('Pact').click();
        mainMenu().find('ul').children('li:nth-child(3)').click();
        cy.wait(1000);
        cy.percySnapshot('test');
      });
    });
  });
});

export {};
