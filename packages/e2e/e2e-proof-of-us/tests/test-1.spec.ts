import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { WebAuthNHelper } from '@kadena-dev/e2e-base/src/helpers/spirekey/webauthn.helper';
import { expect } from '@playwright/test';

const proofTitle = 'Super Fancy Title';
let shareUrl: string;
let initiatorCredential: object;
let signerCredential: object;

const TESTURL = 'https://spirekey-proof-of-us.vercel.app/';
const webAuthNHelper = new WebAuthNHelper();

test('1 Initiator, 1 signers. all participants sign -> Should be able to mint the connection token @xs', async ({
  initiator,
  signer1,
  spirekeyApp,
  proofOfusApp,
}) => {
  await test.step('Create an account for the initiator and create proof', async () => {
    await initiator.goto(TESTURL);
    const popupPromise = initiator.waitForEvent('popup');
    await initiator.getByRole('button', { name: 'Login to mint' }).click();

    const initiatorPopup = await popupPromise;
    const virtualAuthenticator =
      await webAuthNHelper.enableVirtualAuthenticator(initiatorPopup);

    initiatorCredential = await spirekeyApp.createSpireKeyAccountFor(
      initiatorPopup,
      true,
      virtualAuthenticator,
    );

    shareUrl = await proofOfusApp.createProofWith(initiator, proofTitle);
    expect(shareUrl).toBeDefined();
  });

  await test.step('Create an account for the signer', async () => {
    await signer1.goto(TESTURL);
    // Start waiting for popup before clicking. Note no await.
    const popupPromise = signer1.waitForEvent('popup');
    await signer1.getByRole('button', { name: 'Login to mint' }).click();

    const signerPopup = await popupPromise;
    const virtualAuthenticator =
      await webAuthNHelper.enableVirtualAuthenticator(signerPopup);
    signerCredential = await spirekeyApp.createSpireKeyAccountFor(
      signerPopup,
      true,
      virtualAuthenticator,
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
    await webAuthNHelper.enableVirtualAuthenticator(
      signerPopup,
      signerCredential,
    );
    await spirekeyApp.signTransaction(signerPopup);
  });

  await test.step('Sign with Initiator & Mint NFT', async () => {
    const popupPromise = initiator.waitForEvent('popup');
    await proofOfusApp.signAndMintWith(initiator);
    const initiatorPopup = await popupPromise;
    await webAuthNHelper.enableVirtualAuthenticator(
      initiatorPopup,
      initiatorCredential,
    );
    await spirekeyApp.signTransaction(initiatorPopup);
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
});

// test('1 Initiator, 2 signers. all participants sign -> Should be able to mint the connection token @s', async ({
//   initiator,
//   signer1,
//   signer2,
// }) => {
//   await test.step('Create account in SpireKey and initiate a connection in Proof of Us.', async () => {
//     await initiator.goto(TESTURL);
//     // Initiator: Create a SpireKey account
//     await initiator.getByRole('button', { name: 'Login to mint' }).click();
//     await spireKey.createSpireKeyAccountFor(initiator, 'initiator');
//     shareUrl = await proofOfUs.createProofWith(initiator, proofTitle);
//     expect(shareUrl).toBeDefined();
//   });
//   await test.step('Scan the QR code and create an account for all signers', async () => {
//     await Promise.all([signer1.goto(shareUrl), signer2.goto(shareUrl)]);

//     await Promise.all([
//       spireKey.createSpireKeyAccountFor(signer1, 'signer1', true),
//       spireKey.createSpireKeyAccountFor(signer2, 'signer2', true),
//     ]);

//     await Promise.all([signer1.goto(shareUrl), signer2.goto(shareUrl)]);
//   });

//   await test.step('wait for all siners to be in the list', async () => {
//     await proofOfUs.countallSigners(initiator, 2);
//   });

//   // await test.step('Disable Signing for Signer 3', async () => {
//   //   await proofOfUs.disableSigningFor(initiator, 'signer4');
//   // });
//   await test.step('Initiate the Signing Process with Initiator', async () => {
//     await proofOfUs.startSigningProcessWith(initiator);
//   });
//   await test.step('Sign the Proof with the Signers', async () => {
//     await Promise.all([
//       proofOfUs.signProofWith(signer1),
//       proofOfUs.signProofWith(signer2),
//     ]);

//     await Promise.all([
//       spireKey.signTransaction(signer1),
//       spireKey.signTransaction(signer2),
//     ]);
//   });
//   await test.step('Upload the Proof with the Initiator', async () => {
//     // Start waiting for request before clicking. Note no await.
//     await proofOfUs.uploadProofWith(initiator);

//     const requestPromise = initiator.waitForRequest(
//       '**/chain/1/pact/api/v1/poll',
//     );
//     await spireKey.signTransaction(initiator);
//     const postData = (await requestPromise).postData();
//     console.log(postData);
//   });
//   await test.step('The Proof should be succesfully minted for the initiator as well as all the signers', async () => {
//     await Promise.all([
//       expect(initiator.getByRole('heading', { name: proofTitle })).toBeVisible({
//         timeout: 120000,
//       }),
//       expect(signer1.getByRole('heading', { name: proofTitle })).toBeVisible({
//         timeout: 120000,
//       }),
//       expect(signer2.getByRole('heading', { name: proofTitle })).toBeVisible({
//         timeout: 120000,
//       }),
//     ]);
//   });
// });
