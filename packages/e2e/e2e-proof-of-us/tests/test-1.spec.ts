import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { ProofOfUsAppIndex } from '@kadena-dev/e2e-base/src/page-objects/proof-of-us/proofOfusApp.index';
import { SpireKeyIndex } from '@kadena-dev/e2e-base/src/page-objects/spirekey/spirekeyApp.index';
import { expect } from '@playwright/test';

const proofTitle = 'Super Fancy Title';
const spireKey = new SpireKeyIndex();
const proofOfUs = new ProofOfUsAppIndex();
let shareUrl: string;

test('Create Connection Proof with multiple Signers', async ({
  initiator,
  signer1,
  signer2,
  signer3,
  signer4,
  signer5,
}) => {
  await test.step('Create account in SpireKey and initiate a connection in Proof of Us.', async () => {
    await initiator.goto(
      'https://proof-of-us-git-feat-pouinitiatordeletesigners-kadena-js.vercel.app/',
    );
    // Initiator: Create a SpireKey account
    await initiator.getByRole('button', { name: 'Login to mint' }).click();
    await spireKey.createSpireKeyAccountFor(initiator, 'initiator');
    shareUrl = await proofOfUs.createProofWith(initiator, proofTitle);
    expect(shareUrl).toBeDefined();
  });

  await test.step('Scan the QR code and create an account for all signers', async () => {
    await Promise.all([
      signer1.goto(shareUrl),
      signer2.goto(shareUrl),
      signer3.goto(shareUrl),
      signer4.goto(shareUrl),
      signer5.goto(shareUrl),
    ]);

    await Promise.all([
      spireKey.createSpireKeyAccountFor(signer1, 'signer1', true),
      spireKey.createSpireKeyAccountFor(signer2, 'signer2', true),
      spireKey.createSpireKeyAccountFor(signer3, 'signer3', true),
      spireKey.createSpireKeyAccountFor(signer4, 'signer4', true),
      spireKey.createSpireKeyAccountFor(signer5, 'signer5', true),
    ]);

    await Promise.all([
      signer1.goto(shareUrl),
      signer2.goto(shareUrl),
      signer3.goto(shareUrl),
      signer4.goto(shareUrl),
      signer5.goto(shareUrl),
    ]);
  });

  await test.step('Initiate the Signing Process with Initiator', async () => {
    await proofOfUs.startSigningProcessWith(initiator);
  });

  await test.step('Sign the Proof with the Signers', async () => {
    await Promise.all([
      proofOfUs.signProofWith(signer1),
      proofOfUs.signProofWith(signer2),
      proofOfUs.signProofWith(signer3),
      proofOfUs.signProofWith(signer4),
      proofOfUs.signProofWith(signer5),
    ]);

    await Promise.all([
      spireKey.signTransaction(signer1),
      spireKey.signTransaction(signer2),
      spireKey.signTransaction(signer3),
      spireKey.signTransaction(signer4),
      spireKey.signTransaction(signer5),
    ]);
  });

  await test.step('Upload the Proof with the Initiator', async () => {
    await proofOfUs.uploadProofWith(initiator);
    await spireKey.signTransaction(initiator);
  });

  await test.step('The Proof should be succesfully minted for the initiator as well as all the signers', async () => {
    await Promise.all([
      expect(
        initiator.getByRole('heading', { name: proofTitle }),
      ).toBeVisible({timeout: 120000}),
      expect(signer1.getByRole('heading', { name: proofTitle })).toBeVisible({timeout: 120000}),
      expect(signer2.getByRole('heading', { name: proofTitle })).toBeVisible({timeout: 120000}),
      expect(signer3.getByRole('heading', { name: proofTitle })).toBeVisible({timeout: 120000}),
      expect(signer4.getByRole('heading', { name: proofTitle })).toBeVisible({timeout: 120000}),
      expect(signer5.getByRole('heading', { name: proofTitle })).toBeVisible({timeout: 120000}),
    ]);
  });
});
/*
  

*/
