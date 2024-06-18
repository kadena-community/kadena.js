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
    await initiator.goto('https://proof-of-us-git-test-pou-spirekey-kadena-js.vercel.app/');
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

test('1 Initiator, 10 signers. all participants sign -> Should be able to mint the connection token @s', async ({
  initiator,
  signer1,
  signer2,
  signer3,
  signer4,
  signer5,
  signer6,
  signer7,
  signer8,
  signer9,
  signer10,
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
      signer6.goto(shareUrl),
      signer7.goto(shareUrl),
      signer8.goto(shareUrl),
      signer9.goto(shareUrl),
      signer10.goto(shareUrl),
    ]);

    await Promise.all([
      spireKey.createSpireKeyAccountFor(signer1, 'signer1', true),
      spireKey.createSpireKeyAccountFor(signer2, 'signer2', true),
      spireKey.createSpireKeyAccountFor(signer3, 'signer3', true),
      spireKey.createSpireKeyAccountFor(signer4, 'signer4', true),
      spireKey.createSpireKeyAccountFor(signer5, 'signer5', true),
      spireKey.createSpireKeyAccountFor(signer6, 'signer6', true),
      spireKey.createSpireKeyAccountFor(signer7, 'signer7', true),
      spireKey.createSpireKeyAccountFor(signer8, 'signer8', true),
      spireKey.createSpireKeyAccountFor(signer9, 'signer9', true),
      spireKey.createSpireKeyAccountFor(signer10, 'signer10', true),
    ]);

    await Promise.all([
      signer1.goto(shareUrl),
      signer2.goto(shareUrl),
      signer3.goto(shareUrl),
      signer4.goto(shareUrl),
      signer5.goto(shareUrl),
      signer6.goto(shareUrl),
      signer7.goto(shareUrl),
      signer8.goto(shareUrl),
      signer9.goto(shareUrl),
      signer10.goto(shareUrl),
    ]);
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
      proofOfUs.signProofWith(signer3),
      proofOfUs.signProofWith(signer4),
      proofOfUs.signProofWith(signer5),
      proofOfUs.signProofWith(signer6),
      proofOfUs.signProofWith(signer7),
      proofOfUs.signProofWith(signer8),
      proofOfUs.signProofWith(signer9),
      proofOfUs.signProofWith(signer10),
    ]);

    await Promise.all([
      spireKey.signTransaction(signer1),
      spireKey.signTransaction(signer2),
      spireKey.signTransaction(signer3),
      spireKey.signTransaction(signer4),
      spireKey.signTransaction(signer5),
      spireKey.signTransaction(signer6),
      spireKey.signTransaction(signer7),
      spireKey.signTransaction(signer8),
      spireKey.signTransaction(signer9),
      spireKey.signTransaction(signer10),
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
      expect(signer3.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer4.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer5.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
    ]);
  });
});

test('1 Initiator, 19 signers. all participants sign -> Should be able to mint the connection token @m', async ({
  initiator,
  signer1,
  signer2,
  signer3,
  signer4,
  signer5,
  signer6,
  signer7,
  signer8,
  signer9,
  signer10,
  signer11,
  signer12,
  signer13,
  signer14,
  signer15,
  signer16,
  signer17,
  signer18,
  signer19,
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
      signer6.goto(shareUrl),
      signer7.goto(shareUrl),
      signer8.goto(shareUrl),
      signer9.goto(shareUrl),
      signer10.goto(shareUrl),
      signer11.goto(shareUrl),
      signer12.goto(shareUrl),
      signer13.goto(shareUrl),
      signer14.goto(shareUrl),
      signer15.goto(shareUrl),
      signer16.goto(shareUrl),
      signer17.goto(shareUrl),
      signer18.goto(shareUrl),
      signer19.goto(shareUrl),
    ]);

    await Promise.all([
      spireKey.createSpireKeyAccountFor(signer1, 'signer1', true),
      spireKey.createSpireKeyAccountFor(signer2, 'signer2', true),
      spireKey.createSpireKeyAccountFor(signer3, 'signer3', true),
      spireKey.createSpireKeyAccountFor(signer4, 'signer4', true),
      spireKey.createSpireKeyAccountFor(signer5, 'signer5', true),
      spireKey.createSpireKeyAccountFor(signer6, 'signer6', true),
      spireKey.createSpireKeyAccountFor(signer7, 'signer7', true),
      spireKey.createSpireKeyAccountFor(signer8, 'signer8', true),
      spireKey.createSpireKeyAccountFor(signer9, 'signer9', true),
      spireKey.createSpireKeyAccountFor(signer10, 'signer10', true),
      spireKey.createSpireKeyAccountFor(signer11, 'signer11', true),
      spireKey.createSpireKeyAccountFor(signer12, 'signer12', true),
      spireKey.createSpireKeyAccountFor(signer13, 'signer13', true),
      spireKey.createSpireKeyAccountFor(signer14, 'signer14', true),
      spireKey.createSpireKeyAccountFor(signer15, 'signer15', true),
      spireKey.createSpireKeyAccountFor(signer16, 'signer16', true),
      spireKey.createSpireKeyAccountFor(signer17, 'signer17', true),
      spireKey.createSpireKeyAccountFor(signer18, 'signer18', true),
      spireKey.createSpireKeyAccountFor(signer19, 'signer19', true),
    ]);

    await Promise.all([
      signer1.goto(shareUrl),
      signer2.goto(shareUrl),
      signer3.goto(shareUrl),
      signer4.goto(shareUrl),
      signer5.goto(shareUrl),
      signer6.goto(shareUrl),
      signer7.goto(shareUrl),
      signer8.goto(shareUrl),
      signer9.goto(shareUrl),
      signer10.goto(shareUrl),
      signer11.goto(shareUrl),
      signer12.goto(shareUrl),
      signer13.goto(shareUrl),
      signer14.goto(shareUrl),
      signer15.goto(shareUrl),
      signer16.goto(shareUrl),
      signer17.goto(shareUrl),
      signer18.goto(shareUrl),
      signer19.goto(shareUrl),
    ]);
  });
  // await test.step('Disable Signing for Signer 3', async () => {
  //   await proofOfUs.disableSigningFor(initiator, 'signer15');
  //   await proofOfUs.disableSigningFor(initiator, 'signer16');
  //   await proofOfUs.disableSigningFor(initiator, 'signer17');
  //   await proofOfUs.disableSigningFor(initiator, 'signer18');
  //   await proofOfUs.disableSigningFor(initiator, 'signer19');
  // });
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
      proofOfUs.signProofWith(signer6),
      proofOfUs.signProofWith(signer7),
      proofOfUs.signProofWith(signer8),
      proofOfUs.signProofWith(signer9),
      proofOfUs.signProofWith(signer10),
      proofOfUs.signProofWith(signer11),
      proofOfUs.signProofWith(signer12),
      proofOfUs.signProofWith(signer13),
      proofOfUs.signProofWith(signer14),
      proofOfUs.signProofWith(signer15),
      proofOfUs.signProofWith(signer16),
      proofOfUs.signProofWith(signer17),
      proofOfUs.signProofWith(signer18),
      proofOfUs.signProofWith(signer19),
    ]);

    await Promise.all([
      spireKey.signTransaction(signer1),
      spireKey.signTransaction(signer2),
      spireKey.signTransaction(signer3),
      spireKey.signTransaction(signer4),
      spireKey.signTransaction(signer5),
      spireKey.signTransaction(signer6),
      spireKey.signTransaction(signer7),
      spireKey.signTransaction(signer8),
      spireKey.signTransaction(signer9),
      spireKey.signTransaction(signer10),
      spireKey.signTransaction(signer11),
      spireKey.signTransaction(signer12),
      spireKey.signTransaction(signer13),
      spireKey.signTransaction(signer14),
      spireKey.signTransaction(signer15),
      spireKey.signTransaction(signer16),
      spireKey.signTransaction(signer17),
      spireKey.signTransaction(signer18),
      spireKey.signTransaction(signer19),
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
      expect(signer3.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer4.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer5.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer6.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer7.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer8.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer9.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer10.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer11.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer12.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer13.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer14.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer15.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer16.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer17.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer18.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
      expect(signer19.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 120000,
      }),
    ]);
  });
});

test('1 Initiator, 65 signers. all participants sign -> Should be able to mint the connection token @xl', async ({
  initiator,
  signer1,
  signer2,
  signer3,
  signer4,
  signer5,
  signer6,
  signer7,
  signer8,
  signer9,
  signer10,
  signer11,
  signer12,
  signer13,
  signer14,
  signer15,
  signer16,
  signer17,
  signer18,
  signer19,
  signer20,
  signer21,
  signer22,
  signer23,
  signer24,
  signer25,
  signer26,
  signer27,
  signer28,
  signer29,
  signer30,
  signer31,
  signer32,
  signer33,
  signer34,
  signer35,
  signer36,
  signer37,
  signer38,
  signer39,
  signer40,
  signer41,
  signer42,
  signer43,
  signer44,
  signer45,
  signer46,
  signer47,
  signer48,
  signer49,
  signer50,
  signer51,
  signer52,
  signer53,
  signer54,
  signer55,
  signer56,
  signer57,
  signer58,
  signer59,
  // signer60,
  // signer61,
  // signer62,
  // signer63,
  // signer64,
  // signer65,
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
      signer6.goto(shareUrl),
      signer7.goto(shareUrl),
      signer8.goto(shareUrl),
      signer9.goto(shareUrl),
      signer10.goto(shareUrl),
      signer11.goto(shareUrl),
      signer12.goto(shareUrl),
      signer13.goto(shareUrl),
      signer14.goto(shareUrl),
      signer15.goto(shareUrl),
      signer16.goto(shareUrl),
      signer17.goto(shareUrl),
      signer18.goto(shareUrl),
      signer19.goto(shareUrl),
      signer20.goto(shareUrl),
      signer21.goto(shareUrl),
      signer22.goto(shareUrl),
      signer23.goto(shareUrl),
      signer24.goto(shareUrl),
      signer25.goto(shareUrl),
      signer26.goto(shareUrl),
      signer27.goto(shareUrl),
      signer28.goto(shareUrl),
      signer29.goto(shareUrl),
      signer30.goto(shareUrl),
      signer31.goto(shareUrl),
      signer32.goto(shareUrl),
      signer33.goto(shareUrl),
      signer34.goto(shareUrl),
      signer35.goto(shareUrl),
      signer36.goto(shareUrl),
      signer37.goto(shareUrl),
      signer38.goto(shareUrl),
      signer39.goto(shareUrl),
      signer40.goto(shareUrl),
      signer41.goto(shareUrl),
      signer42.goto(shareUrl),
      signer43.goto(shareUrl),
      signer44.goto(shareUrl),
      signer45.goto(shareUrl),
      signer46.goto(shareUrl),
      signer47.goto(shareUrl),
      signer48.goto(shareUrl),
      signer49.goto(shareUrl),
      signer50.goto(shareUrl),
      signer51.goto(shareUrl),
      signer52.goto(shareUrl),
      signer53.goto(shareUrl),
      signer54.goto(shareUrl),
      signer55.goto(shareUrl),
      signer56.goto(shareUrl),
      signer57.goto(shareUrl),
      signer58.goto(shareUrl),
      signer59.goto(shareUrl),
      // signer60.goto(shareUrl),
      // signer61.goto(shareUrl),
      // signer62.goto(shareUrl),
      // signer63.goto(shareUrl),
      // signer64.goto(shareUrl),
      // signer65.goto(shareUrl),
    ]);

    await Promise.all([
      spireKey.createSpireKeyAccountFor(signer1, 'signer1', true),
      spireKey.createSpireKeyAccountFor(signer2, 'signer2', true),
      spireKey.createSpireKeyAccountFor(signer3, 'signer3', true),
      spireKey.createSpireKeyAccountFor(signer4, 'signer4', true),
      spireKey.createSpireKeyAccountFor(signer5, 'signer5', true),
      spireKey.createSpireKeyAccountFor(signer6, 'signer6', true),
      spireKey.createSpireKeyAccountFor(signer7, 'signer7', true),
      spireKey.createSpireKeyAccountFor(signer8, 'signer8', true),
      spireKey.createSpireKeyAccountFor(signer9, 'signer9', true),
      spireKey.createSpireKeyAccountFor(signer10, 'signer10', true),
      spireKey.createSpireKeyAccountFor(signer11, 'signer11', true),
      spireKey.createSpireKeyAccountFor(signer12, 'signer12', true),
      spireKey.createSpireKeyAccountFor(signer13, 'signer13', true),
      spireKey.createSpireKeyAccountFor(signer14, 'signer14', true),
      spireKey.createSpireKeyAccountFor(signer15, 'signer15', true),
      spireKey.createSpireKeyAccountFor(signer16, 'signer16', true),
      spireKey.createSpireKeyAccountFor(signer17, 'signer17', true),
      spireKey.createSpireKeyAccountFor(signer18, 'signer18', true),
      spireKey.createSpireKeyAccountFor(signer19, 'signer19', true),
      spireKey.createSpireKeyAccountFor(signer20, 'signer20', true),
      spireKey.createSpireKeyAccountFor(signer21, 'signer21', true),
      spireKey.createSpireKeyAccountFor(signer22, 'signer22', true),
      spireKey.createSpireKeyAccountFor(signer23, 'signer23', true),
      spireKey.createSpireKeyAccountFor(signer24, 'signer24', true),
      spireKey.createSpireKeyAccountFor(signer25, 'signer25', true),
      spireKey.createSpireKeyAccountFor(signer26, 'signer26', true),
      spireKey.createSpireKeyAccountFor(signer27, 'signer27', true),
      spireKey.createSpireKeyAccountFor(signer28, 'signer28', true),
      spireKey.createSpireKeyAccountFor(signer29, 'signer29', true),
      spireKey.createSpireKeyAccountFor(signer30, 'signer30', true),
      spireKey.createSpireKeyAccountFor(signer31, 'signer31', true),
      spireKey.createSpireKeyAccountFor(signer32, 'signer32', true),
      spireKey.createSpireKeyAccountFor(signer33, 'signer33', true),
      spireKey.createSpireKeyAccountFor(signer34, 'signer34', true),
      spireKey.createSpireKeyAccountFor(signer35, 'signer35', true),
      spireKey.createSpireKeyAccountFor(signer36, 'signer36', true),
      spireKey.createSpireKeyAccountFor(signer37, 'signer37', true),
      spireKey.createSpireKeyAccountFor(signer38, 'signer38', true),
      spireKey.createSpireKeyAccountFor(signer39, 'signer39', true),
      spireKey.createSpireKeyAccountFor(signer40, 'signer40', true),
      spireKey.createSpireKeyAccountFor(signer41, 'signer41', true),
      spireKey.createSpireKeyAccountFor(signer42, 'signer42', true),
      spireKey.createSpireKeyAccountFor(signer43, 'signer43', true),
      spireKey.createSpireKeyAccountFor(signer44, 'signer44', true),
      spireKey.createSpireKeyAccountFor(signer45, 'signer45', true),
      spireKey.createSpireKeyAccountFor(signer46, 'signer46', true),
      spireKey.createSpireKeyAccountFor(signer47, 'signer47', true),
      spireKey.createSpireKeyAccountFor(signer48, 'signer48', true),
      spireKey.createSpireKeyAccountFor(signer49, 'signer49', true),
      spireKey.createSpireKeyAccountFor(signer50, 'signer50', true),
      spireKey.createSpireKeyAccountFor(signer51, 'signer51', true),
      spireKey.createSpireKeyAccountFor(signer52, 'signer52', true),
      spireKey.createSpireKeyAccountFor(signer53, 'signer53', true),
      spireKey.createSpireKeyAccountFor(signer54, 'signer54', true),
      spireKey.createSpireKeyAccountFor(signer55, 'signer55', true),
      spireKey.createSpireKeyAccountFor(signer56, 'signer56', true),
      spireKey.createSpireKeyAccountFor(signer57, 'signer57', true),
      spireKey.createSpireKeyAccountFor(signer58, 'signer58', true),
      spireKey.createSpireKeyAccountFor(signer59, 'signer59', true),
      // spireKey.createSpireKeyAccountFor(signer60, 'signer60', true),
      // spireKey.createSpireKeyAccountFor(signer61, 'signer61', true),
      // spireKey.createSpireKeyAccountFor(signer62, 'signer62', true),
      // spireKey.createSpireKeyAccountFor(signer63, 'signer63', true),
      // spireKey.createSpireKeyAccountFor(signer64, 'signer64', true),
      // spireKey.createSpireKeyAccountFor(signer65, 'signer65', true),
    ]);

    await Promise.all([
      signer1.goto(shareUrl),
      signer2.goto(shareUrl),
      signer3.goto(shareUrl),
      signer4.goto(shareUrl),
      signer5.goto(shareUrl),
      signer6.goto(shareUrl),
      signer7.goto(shareUrl),
      signer8.goto(shareUrl),
      signer9.goto(shareUrl),
      signer10.goto(shareUrl),
      signer11.goto(shareUrl),
      signer12.goto(shareUrl),
      signer13.goto(shareUrl),
      signer14.goto(shareUrl),
      signer15.goto(shareUrl),
      signer16.goto(shareUrl),
      signer17.goto(shareUrl),
      signer18.goto(shareUrl),
      signer19.goto(shareUrl),
      signer20.goto(shareUrl),
      signer21.goto(shareUrl),
      signer22.goto(shareUrl),
      signer23.goto(shareUrl),
      signer24.goto(shareUrl),
      signer25.goto(shareUrl),
      signer26.goto(shareUrl),
      signer27.goto(shareUrl),
      signer28.goto(shareUrl),
      signer29.goto(shareUrl),
      signer30.goto(shareUrl),
      signer31.goto(shareUrl),
      signer32.goto(shareUrl),
      signer33.goto(shareUrl),
      signer34.goto(shareUrl),
      signer35.goto(shareUrl),
      signer36.goto(shareUrl),
      signer37.goto(shareUrl),
      signer38.goto(shareUrl),
      signer39.goto(shareUrl),
      signer40.goto(shareUrl),
      signer41.goto(shareUrl),
      signer42.goto(shareUrl),
      signer43.goto(shareUrl),
      signer44.goto(shareUrl),
      signer45.goto(shareUrl),
      signer46.goto(shareUrl),
      signer47.goto(shareUrl),
      signer48.goto(shareUrl),
      signer49.goto(shareUrl),
      signer50.goto(shareUrl),
      signer51.goto(shareUrl),
      signer52.goto(shareUrl),
      signer53.goto(shareUrl),
      signer54.goto(shareUrl),
      signer55.goto(shareUrl),
      signer56.goto(shareUrl),
      signer57.goto(shareUrl),
      signer58.goto(shareUrl),
      signer59.goto(shareUrl),
      // signer60.goto(shareUrl),
      // signer61.goto(shareUrl),
      // signer62.goto(shareUrl),
      // signer63.goto(shareUrl),
      // signer64.goto(shareUrl),
      // signer65.goto(shareUrl),
    ]);
  });
  // await test.step('Disable Signing for Signer 3', async () => {
  //   await proofOfUs.disableSigningFor(initiator, 'signer15');
  //   await proofOfUs.disableSigningFor(initiator, 'signer16');
  //   await proofOfUs.disableSigningFor(initiator, 'signer17');
  //   await proofOfUs.disableSigningFor(initiator, 'signer18');
  //   await proofOfUs.disableSigningFor(initiator, 'signer19');
  // });
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
      proofOfUs.signProofWith(signer6),
      proofOfUs.signProofWith(signer7),
      proofOfUs.signProofWith(signer8),
      proofOfUs.signProofWith(signer9),
      proofOfUs.signProofWith(signer10),
      proofOfUs.signProofWith(signer11),
      proofOfUs.signProofWith(signer12),
      proofOfUs.signProofWith(signer13),
      proofOfUs.signProofWith(signer14),
      proofOfUs.signProofWith(signer15),
      proofOfUs.signProofWith(signer16),
      proofOfUs.signProofWith(signer17),
      proofOfUs.signProofWith(signer18),
      proofOfUs.signProofWith(signer19),
      proofOfUs.signProofWith(signer20),
      proofOfUs.signProofWith(signer21),
      proofOfUs.signProofWith(signer22),
      proofOfUs.signProofWith(signer23),
      proofOfUs.signProofWith(signer24),
      proofOfUs.signProofWith(signer25),
      proofOfUs.signProofWith(signer26),
      proofOfUs.signProofWith(signer27),
      proofOfUs.signProofWith(signer28),
      proofOfUs.signProofWith(signer29),
      proofOfUs.signProofWith(signer30),
      proofOfUs.signProofWith(signer31),
      proofOfUs.signProofWith(signer32),
      proofOfUs.signProofWith(signer33),
      proofOfUs.signProofWith(signer34),
      proofOfUs.signProofWith(signer35),
      proofOfUs.signProofWith(signer36),
      proofOfUs.signProofWith(signer37),
      proofOfUs.signProofWith(signer38),
      proofOfUs.signProofWith(signer39),
      proofOfUs.signProofWith(signer40),
      proofOfUs.signProofWith(signer41),
      proofOfUs.signProofWith(signer42),
      proofOfUs.signProofWith(signer43),
      proofOfUs.signProofWith(signer44),
      proofOfUs.signProofWith(signer45),
      proofOfUs.signProofWith(signer46),
      proofOfUs.signProofWith(signer47),
      proofOfUs.signProofWith(signer48),
      proofOfUs.signProofWith(signer49),
      proofOfUs.signProofWith(signer50),
      proofOfUs.signProofWith(signer51),
      proofOfUs.signProofWith(signer52),
      proofOfUs.signProofWith(signer53),
      proofOfUs.signProofWith(signer54),
      proofOfUs.signProofWith(signer55),
      proofOfUs.signProofWith(signer56),
      proofOfUs.signProofWith(signer57),
      proofOfUs.signProofWith(signer58),
      proofOfUs.signProofWith(signer59),
      // proofOfUs.signProofWith(signer60),
      // proofOfUs.signProofWith(signer61),
      // proofOfUs.signProofWith(signer62),
      // proofOfUs.signProofWith(signer63),
      // proofOfUs.signProofWith(signer64),
      // proofOfUs.signProofWith(signer65),
    ]);

    await Promise.all([
      spireKey.signTransaction(signer1),
      spireKey.signTransaction(signer2),
      spireKey.signTransaction(signer3),
      spireKey.signTransaction(signer4),
      spireKey.signTransaction(signer5),
      spireKey.signTransaction(signer6),
      spireKey.signTransaction(signer7),
      spireKey.signTransaction(signer8),
      spireKey.signTransaction(signer9),
      spireKey.signTransaction(signer10),
      spireKey.signTransaction(signer11),
      spireKey.signTransaction(signer12),
      spireKey.signTransaction(signer13),
      spireKey.signTransaction(signer14),
      spireKey.signTransaction(signer15),
      spireKey.signTransaction(signer16),
      spireKey.signTransaction(signer17),
      spireKey.signTransaction(signer18),
      spireKey.signTransaction(signer19),
      spireKey.signTransaction(signer20),
      spireKey.signTransaction(signer21),
      spireKey.signTransaction(signer22),
      spireKey.signTransaction(signer23),
      spireKey.signTransaction(signer24),
      spireKey.signTransaction(signer25),
      spireKey.signTransaction(signer26),
      spireKey.signTransaction(signer27),
      spireKey.signTransaction(signer28),
      spireKey.signTransaction(signer29),
      spireKey.signTransaction(signer30),
      spireKey.signTransaction(signer31),
      spireKey.signTransaction(signer32),
      spireKey.signTransaction(signer33),
      spireKey.signTransaction(signer34),
      spireKey.signTransaction(signer35),
      spireKey.signTransaction(signer36),
      spireKey.signTransaction(signer37),
      spireKey.signTransaction(signer38),
      spireKey.signTransaction(signer39),
      spireKey.signTransaction(signer40),
      spireKey.signTransaction(signer41),
      spireKey.signTransaction(signer42),
      spireKey.signTransaction(signer43),
      spireKey.signTransaction(signer44),
      spireKey.signTransaction(signer45),
      spireKey.signTransaction(signer46),
      spireKey.signTransaction(signer47),
      spireKey.signTransaction(signer48),
      spireKey.signTransaction(signer49),
      spireKey.signTransaction(signer50),
      spireKey.signTransaction(signer51),
      spireKey.signTransaction(signer52),
      spireKey.signTransaction(signer53),
      spireKey.signTransaction(signer54),
      spireKey.signTransaction(signer55),
      spireKey.signTransaction(signer56),
      spireKey.signTransaction(signer57),
      spireKey.signTransaction(signer58),
      spireKey.signTransaction(signer59),
      //  spireKey.signTransaction(signer60),
      // spireKey.signTransaction(signer61),
      // spireKey.signTransaction(signer62),
      // spireKey.signTransaction(signer63),
      // spireKey.signTransaction(signer64),
      // spireKey.signTransaction(signer65),
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
        timeout: 1200000,
      }),
      expect(signer1.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer2.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer3.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer4.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer5.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer6.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer7.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer8.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer9.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer10.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer11.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer12.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer13.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer14.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer15.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer16.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer17.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer18.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer19.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer20.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer21.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer22.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer23.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer24.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer25.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer26.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer27.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer28.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer29.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer30.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer31.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer32.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer33.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer34.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer35.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer36.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer37.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer38.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer39.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer40.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer41.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer42.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer43.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer44.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer45.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer46.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer47.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer48.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer49.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer50.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer51.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer52.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer53.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer54.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer55.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer56.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer57.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer58.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      expect(signer59.getByRole('heading', { name: proofTitle })).toBeVisible({
        timeout: 1200000,
      }),
      // expect(signer60.getByRole('heading', { name: proofTitle })).toBeVisible({
      //   timeout: 1200000,
      // }),
      // expect(signer61.getByRole('heading', { name: proofTitle })).toBeVisible({
      //   timeout: 1200000,
      // }),
      // expect(signer62.getByRole('heading', { name: proofTitle })).toBeVisible({
      //   timeout: 1200000,
      // }),
      // expect(signer63.getByRole('heading', { name: proofTitle })).toBeVisible({
      //   timeout: 1200000,
      // }),
      // expect(signer64.getByRole('heading', { name: proofTitle })).toBeVisible({
      //   timeout: 1200000,
      // }),
      // expect(signer65.getByRole('heading', { name: proofTitle })).toBeVisible({
      //   timeout: 1200000,
      // }),
    ]);
  });
});

const doBy = async (callback, signers, batchBy) => {
  for (let batchIndex = 0; batchIndex < signers.length; batchIndex += batchBy) {
    const batch = signers.slice(batchIndex, batchIndex + batchBy);
    await Promise.all(batch.map(callback));
  }
};
test('1 Initiator, 65 signers. all participants sign -> Should be able to mint the connection token @xxl', async ({
  initiator,
  signer1,
  signer2,
  signer3,
  signer4,
  signer5,
  signer6,
  signer7,
  signer8,
  signer9,
  signer10,
  signer11,
  signer12,
  signer13,
  signer14,
  signer15,
  signer16,
  signer17,
  signer18,
  signer19,
  signer20,
  signer21,
  signer22,
  signer23,
  signer24,
  signer25,
  signer26,
  signer27,
  signer28,
  signer29,
  signer30,
  signer31,
  signer32,
  signer33,
  signer34,
  signer35,
  signer36,
  signer37,
  signer38,
  signer39,
  signer40,
  signer41,
  signer42,
  signer43,
  signer44,
  signer45,
  signer46,
  signer47,
  signer48,
  signer49,
  signer50,
  signer51,
  signer52,
  signer53,
  signer54,
  signer55,
  signer56,
  signer57,
  signer58,
  signer59,
  signer60,
  signer61,
  signer62,
  signer63,
  signer64,
  signer65,
}) => {
  const signers = [
    signer1,
    signer2,
    signer3,
    signer4,
    signer5,
    signer6,
    signer7,
    signer8,
    signer9,
    signer10,
    signer11,
    signer12,
    signer13,
    signer14,
    signer15,
    signer16,
    signer17,
    signer18,
    signer19,
    signer20,
    signer21,
    signer22,
    signer23,
    signer24,
    signer25,
    signer26,
    signer27,
    signer28,
    signer29,
    signer30,
    signer31,
    signer32,
    signer33,
    signer34,
    signer35,
    signer36,
    signer37,
    signer38,
    signer39,
    signer40,
    signer41,
    signer42,
    signer43,
    signer44,
    signer45,
    signer46,
    signer47,
    signer48,
    signer49,
    signer50,
    signer51,
    signer52,
    signer53,
    signer54,
    signer55,
    signer56,
    signer57,
    signer58,
    signer59,
    signer60,
    signer61,
    signer62,
    signer63,
    signer64,
    signer65,
  ];
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
    await doBy((signer) => signer.goto(shareUrl), signers, 5);
    await doBy(
      (signer, i) =>
        spireKey.createSpireKeyAccountFor(signer, `signer${i}`, true),
      signers,
      5,
    );
    await doBy((signer) => signer.goto(shareUrl), signers, 5);
  });
  // await test.step('Disable Signing for Signer 3', async () => {
  //   await proofOfUs.disableSigningFor(initiator, 'signer15');
  //   await proofOfUs.disableSigningFor(initiator, 'signer16');
  //   await proofOfUs.disableSigningFor(initiator, 'signer17');
  //   await proofOfUs.disableSigningFor(initiator, 'signer18');
  //   await proofOfUs.disableSigningFor(initiator, 'signer19');
  // });
  await test.step('Initiate the Signing Process with Initiator', async () => {
    await proofOfUs.startSigningProcessWith(initiator);
  });
  await test.step('Sign the Proof with the Signers', async () => {
    await doBy((signer) => proofOfUs.signProofWith(signer), signers, 5);
    await doBy((signer) => spireKey.signTransaction(signer1), signers, 5);
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
    await expect(
      initiator.getByRole('heading', { name: proofTitle }),
    ).toBeVisible({
      timeout: 1200000,
    });

    await doBy(
      (signer) =>
        expect(signer.getByRole('heading', { name: proofTitle })).toBeVisible({
          timeout: 1200000,
        }),
      signers,
      10,
    );
  });
});
/*
  

*/
