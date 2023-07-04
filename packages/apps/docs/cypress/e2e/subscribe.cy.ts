import { IResponse } from '../../src/pages/api/subscribe';
import { closeConsentModal } from '../utils';

describe('Subscribe to mailList', () => {
  const subscribe = () => cy.get('[data-cy="subscribe"]');
  const getData = (data: IResponse<{}>) => {
    cy.intercept(
      {
        method: 'POST', // Route all GET requests
        url: '/api/subscribe',
      },
      data, // and force the response to be: []
    ).as('postSubcribe'); // and assign an alias
  };

  beforeEach(() => {
    cy.visit('/docs/__tests/pact/atom-sdk');
    closeConsentModal();
  });

  it('submit a correct email, happy path', () => {
    getData({
      status: 200,
      message: 'Thank you for subscribing',
    });

    cy.percySnapshot('test');
    subscribe().should('be.visible');

    subscribe()
      .find('input[type="email"]')
      .type('he-man@masteroftheuniverse.com{enter}', { delay: 10 });

    subscribe().find('input[type="email"]').should('not.exist');

    subscribe().contains('Thank you for subscribing');
  });

  it('submit a correct email, breaks because of something wrong in BE', () => {
    getData({
      status: 500,
      message: 'Something went wrong',
    });

    subscribe()
      .find('input[type="email"]')
      .type('he-man@masteroftheuniverse.com{enter}', { delay: 10 });

    subscribe().find('input[type="email"]').should('exist');
    subscribe().contains('Something went wrong');
  });

  it('type a invalid email and the submit button should be disabled. and not submit', () => {
    getData({
      status: 200,
      message: 'Thank you for subscribing',
    });

    subscribe()
      .find('input[type="email"]')
      .type('!!skeletor@thundercars.com', { delay: 10 });
    subscribe()
      .find('button[type="submit"]')
      .should('have.attr', 'disabled', 'disabled');
  });
});

export {};
