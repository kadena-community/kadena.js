import { IResponse } from '../../src/pages/api/subscribe';
import { closeConsentModal } from '../utils';

const COOKIECONSENTNAME = 'cookie_consent';
describe('Consent box', () => {
  beforeEach(() => {
    cy.visit('/docs/__tests/pact/atom-sdk');
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('checks that consent modal is visible', () => {
    cy.get('[data-cy="modal-background"]').should('exist');
    cy.get('[data-cy="modal"]').should('be.visible').contains('Cookie consent');
    cy.get('[data-cy="modal"]').find('button').should('have.length', 3);
  });

  describe('no consent set', () => {
    beforeEach(() => {
      window.localStorage.clear();
    });
    it('checks that the consent cookie is not set on start', () => {
      const cookieValue = window.localStorage.getItem(COOKIECONSENTNAME);
      cy.expect(cookieValue).to.equal(null);
      cy.get('[data-cy="modal"]').should('be.visible');
    });

    describe('consent to false', () => {
      it('checks that the consent cookie is set to false, on reject', () => {
        cy.get('[data-cy="modal"]').should('exist');
        cy.get('[data-cy="modal"]').find('button').eq(2).contains('Reject');
        cy.get('[data-cy="modal"]').find('button').eq(2).click();
        cy.get('[data-cy="modal"]').should('not.exist');
      });
      afterEach(() => {
        cy.expect(window.localStorage.getItem(COOKIECONSENTNAME)).to.equal(
          'false',
        );
      });
    });

    describe('consent to true', () => {
      it('checks that the consent cookie is set to true, on approve', () => {
        cy.get('[data-cy="modal"]').should('exist');
        cy.get('[data-cy="modal"]').find('button').eq(1).contains('Accept');
        cy.get('[data-cy="modal"]').find('button').eq(1).click();
        cy.get('[data-cy="modal"]').should('not.exist');
      });
      afterEach(() => {
        cy.expect(window.localStorage.getItem(COOKIECONSENTNAME)).to.equal(
          'true',
        );
      });
    });

    describe('no consent shown', () => {
      beforeEach(() => {
        window.localStorage.setItem(COOKIECONSENTNAME, 'true');
      });
      it('checks that modal is not shown, if COOKIECONSENTNAME is already set', () => {
        cy.wait(500);
        cy.get('[data-cy="modal"]').should('not.exist');
      });
    });
  });
});

export {};
