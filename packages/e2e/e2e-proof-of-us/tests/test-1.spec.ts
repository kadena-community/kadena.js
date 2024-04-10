import { test } from '@kadena-dev/e2e-base/src/fixtures/shared/test.fixture';
import { SpireKeyIndex } from '@kadena-dev/e2e-base/src/page-objects/spirekey/spirekeyApp.index';
import { ProofOfUsAppIndex } from '@kadena-dev/e2e-base/src/page-objects/proof-of-us/proofOfusApp.index';
import { expect } from '@playwright/test';

test('test', async ({ initiator, signer1 }) => {
  //Initiator: Open the Proof of Us App
  await initiator.goto(
    'https://proof-of-us-git-feat-pouinitiatordeletesigners-kadena-js.vercel.app/',
  );

  // Initiator: Close Cookie message and login
  await initiator.getByRole('button', { name: 'Accept' }).click();
  await initiator.getByRole('button', { name: 'Login to mint' }).click();

  const spireKey = new SpireKeyIndex();
  const proofOfUs = new ProofOfUsAppIndex();

  // Initiator: Create a SpireKey account
  await spireKey.createSpireKeyAccountFor(initiator, 'initiator');

  const shareUrl = await proofOfUs.createProofWith(initiator, 'Super Fancy Title');
  
  expect(shareUrl).toBeDefined();
  console.log('shareurl', shareUrl);

  // Open the QR code in a new tab
  await signer1.goto(shareUrl);

  // Create a SpireKey account for the signer
  await spireKey.createSpireKeyAccountFor(signer1, 'signer1');

  // Workaround: There's a redirect bug in the app, so we need to navigate to the shareUrl again
  await signer1.goto(shareUrl);

    /*
  Additional signers would have to create accounts here
  */

  // Initiate the Signing Process with Initiator
  await proofOfUs.startSigningProcessWith(initiator)

  // Sign the proof with the signer
  await proofOfUs.signProofWith(signer1);

  // Sign with Spirekey for the Signer(s)
  await spireKey.signTransaction(signer1);

  /*
  Additional signers would have to be added here to sign for the proof
  */

   //  Initiator uploads the signs & uploads the proof
   await proofOfUs.uploadProofWith(initiator);
  
   // Sign with Spirekey for the initiator
   await spireKey.signTransaction(initiator);
});
/*
  

*/
