import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { expect } from '@playwright/test';

const proofTitle = 'Super Fancy Title';
let shareUrl: string;
let initiatorCredential: object;
let signerCredential: object;

const TESTURL = 'http://localhost:3000/';

test('1 Initiator, 1 signers. all participants sign -> Should be able to mint the connection token @xs', async ({
  initiator,
  signer1,
  spirekeyApp,
  proofOfusApp,
}) => {
  await test.step('Create an account for the initiator and create proof', async () => {
    await initiator.goto(TESTURL);
    const popupPromise = initiator.waitForEvent('popup');
    await proofOfusApp.loginToMintWith(initiator);
    const initiatorPopup = await popupPromise;
    initiatorCredential = await spirekeyApp.createSpireKeyAccountFor(
      initiatorPopup,
      true,
    );

    shareUrl = await proofOfusApp.createProofWith(initiator, proofTitle);
    expect(shareUrl).toBeDefined();
  });

  await test.step('Create an account for the signer', async () => {
    await signer1.goto(shareUrl);
    const popupPromise = signer1.waitForEvent('popup');
    await proofOfusApp.loginToMintWithSigner(signer1);

    const signerPopup = await popupPromise;
    signerCredential = await spirekeyApp.createSpireKeyAccountFor(
      signerPopup,
      true,
    );
  });

  await test.step('Scan the QR code and create an account for all signers', async () => {
    await signer1.goto(shareUrl);
  });

  await test.step('Initiate the Signing Process with Initiator', async () => {
    await proofOfusApp.startSigningProcessWith(initiator);
  });

  await test.step('Sign with the Signer', async () => {
    const popupPromise = signer1.waitForEvent('popup');

    await proofOfusApp.signProofWith(signer1);
    const signerPopup = await popupPromise;
    await spirekeyApp.signTransaction(signerPopup, signerCredential);
  });

  await test.step('Sign with Initiator & Mint NFT', async () => {
    const popupPromise = initiator.waitForEvent('popup');
    await proofOfusApp.signAndMintWith(initiator);
    const initiatorPopup = await popupPromise;
    await spirekeyApp.signTransaction(initiatorPopup, initiatorCredential);
  });

  await test.step('The Proof should be succesfully minted for the initiator as well as all the signers', async () => {
    await Promise.all([
      expect(initiator.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer1.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
    ]);
  });

  await test.step('DEBUG: log link to block explorer', async () => {
    await proofOfusApp.logBlockExplorerUrl(initiator);
  });
});
