import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { ProofOfUsAppIndex } from '@kadena-dev/e2e-base/src/page-objects/proof-of-us/proofOfusApp.index';
import { SpireKeyIndex } from '@kadena-dev/e2e-base/src/page-objects/spirekey/spirekeyApp.index';
import { expect } from '@playwright/test';

const proofTitle = 'Super Fancy Title';
const spireKey = new SpireKeyIndex();
const proofOfUs = new ProofOfUsAppIndex();
let shareUrl: string;

test('1 Initiator, 1 signers. all participants sign -> Should be able to mint the connection token @xs', async ({
  initiator,
  signer1,
}) => {
  await test.step('Create account in SpireKey and initiate a connection in Proof of Us.', async () => {
    await initiator.goto('https://proof-of-agao4ohsw-kadena-js.vercel.app/');
    // Initiator: Create a SpireKey account
    await initiator.getByRole('button', { name: 'Login to mint' }).click();
    await spireKey.createSpireKeyAccountFor(initiator, 'initiator');
    shareUrl = await proofOfUs.createProofWith(initiator, proofTitle);
    expect(shareUrl).toBeDefined();
  });
  await test.step('Scan the QR code and create an account for all signers', async () => {
    await Promise.all([signer1.goto(shareUrl)]);

    await Promise.all([
      spireKey.createSpireKeyAccountFor(signer1, 'signer1', true),
    ]);

    await Promise.all([signer1.goto(shareUrl)]);
  });
  // await test.step('Disable Signing for Signer 3', async () => {
  //   await proofOfUs.disableSigningFor(initiator, 'signer4');
  // });
  await test.step('Initiate the Signing Process with Initiator', async () => {
    await proofOfUs.startSigningProcessWith(initiator);
  });
  await test.step('Sign the Proof with the Signers', async () => {
    await Promise.all([proofOfUs.signProofWith(signer1)]);

    await Promise.all([spireKey.signTransaction(signer1)]);
  });
  await test.step('Upload the Proof with the Initiator', async () => {
    // Start waiting for request before clicking. Note no await.
    await proofOfUs.uploadProofWith(initiator);

    const requestPromise = initiator.waitForRequest(
      '**/chain/1/pact/api/v1/poll',
    );

    await spireKey.signTransaction(initiator);
    const postData = (await requestPromise).postData();
    console.log(postData);
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

test('1 Initiator, 2 signers. all participants sign -> Should be able to mint the connection token @s', async ({
  initiator,
  signer1,
  signer2,
}) => {
  await test.step('Create account in SpireKey and initiate a connection in Proof of Us.', async () => {
    await initiator.goto('https://proof-of-agao4ohsw-kadena-js.vercel.app/');
    // Initiator: Create a SpireKey account
    await initiator.getByRole('button', { name: 'Login to mint' }).click();
    await spireKey.createSpireKeyAccountFor(initiator, 'initiator');
    shareUrl = await proofOfUs.createProofWith(initiator, proofTitle);
    expect(shareUrl).toBeDefined();
  });
  await test.step('Scan the QR code and create an account for all signers', async () => {
    await Promise.all([signer1.goto(shareUrl), signer2.goto(shareUrl)]);

    await Promise.all([
      spireKey.createSpireKeyAccountFor(signer1, 'signer1', true),
      spireKey.createSpireKeyAccountFor(signer2, 'signer2', true),
    ]);

    await Promise.all([signer1.goto(shareUrl), signer2.goto(shareUrl)]);
  });

  await test.step('wait for all siners to be in the list', async () => {
    await proofOfUs.countallSigners(initiator, 2);
  });

  // await test.step('Disable Signing for Signer 3', async () => {
  //   await proofOfUs.disableSigningFor(initiator, 'signer4');
  // });
  await test.step('Initiate the Signing Process with Initiator', async () => {
    await proofOfUs.startSigningProcessWith(initiator);
  });
  await test.step('Sign the Proof with the Signers', async () => {
    await Promise.all([
      proofOfUs.signProofWith(signer1),
      proofOfUs.signProofWith(signer2),
    ]);

    await Promise.all([
      spireKey.signTransaction(signer1),
      spireKey.signTransaction(signer2),
    ]);
  });
  await test.step('Upload the Proof with the Initiator', async () => {
    // Start waiting for request before clicking. Note no await.
    await proofOfUs.uploadProofWith(initiator);

    const requestPromise = initiator.waitForRequest(
      '**/chain/1/pact/api/v1/poll',
    );
    await spireKey.signTransaction(initiator);
    const postData = (await requestPromise).postData();
    console.log(postData);
  });
  await test.step('The Proof should be succesfully minted for the initiator as well as all the signers', async () => {
    await Promise.all([
      expect(initiator.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer1.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer2.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
    ]);
  });
});
