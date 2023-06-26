export const closeConsentModal = () => {
  cy.get('[data-cy="modal-background"]', { timeout: 10000 }).click({
    x: 10,
    y: 10,
    force: true,
  });
};
