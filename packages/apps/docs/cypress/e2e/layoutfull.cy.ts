import { closeConsentModal } from '../utils';

describe('full layout', () => {
  const aside = () => cy.get('[data-cy="aside"]');
  const menu = () => cy.get('[data-cy="menu"]');
  const breadcrumbs = () => cy.get('[data-cy="breadcrumbs"]');

  beforeEach(() => {
    cy.visit('/docs/__tests/pact/atom-sdk');
    closeConsentModal();
  });
  describe('desktop', () => {
    it('shows the breadcrumbs with icon', () => {
      breadcrumbs().find('li').should('have.length', 3);
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

    describe('test the functionality of the sidemenu', () => {
      const ListMenu = () => secondMenu().find('ul > li:nth-child(2)');
      it('shows the left menu', () => {
        openMenu();

        const Atom = () => ListMenu().find('ul > li:nth-child(4)');
        const QuickStart = () => Atom().find(' > ul > li > a[data-active]');

        // check if everything is there
        menu().find('h5').contains('Test');
        secondMenu().find('ul:first-child > li').should('have.length', 4);
        Atom().find(' > button').contains('Atom SDK');

        QuickStart().contains('Quickstart');

        Atom()
          .find(' > ul')
          .should('be.visible')
          .children('li')
          .should('have.length', 2);
      });

      it('opens and closes the basics menu when clicked', () => {
        openMenu();
        const basics = () => ListMenu().find('li:nth-child(3)');
        basics().contains('Basics');
        basics().find('ul').should('not.be.visible');
        basics().click();
        basics().find('ul').should('be.visible');
        basics()
          .children('ul')
          .children('li > [data-active="true"]')
          .should('have.length', 0);
        basics().children('ul').children('li').should('have.length', 2);
        basics().children('ul').children('li').eq(1).click();
        basics()
          .children('ul')
          .find('> li > [data-active="true"]')
          .should('have.length', 1)
          .first()
          .contains('Build-in Functions');
      });

      it('shows the main menu when "Pact" backbutton is clicked', () => {
        openMenu();
        menu().find('h5').contains('Test').click();
        menu().find('h5').contains('Kadena Docs');

        mainMenu().find('ul > li:last-child').contains('Test').click();

        menu().find('h5').contains('Test');
      });
      it('opens a new page when Chainweb is clicked in the main menu', () => {
        openMenu();
        menu().find('h5').contains('Test').click();
        mainMenu().find('ul').children('li:nth-child(3)').click();
        cy.wait(1000);
        cy.percySnapshot('test');
      });
    });
  });
});

export {};
