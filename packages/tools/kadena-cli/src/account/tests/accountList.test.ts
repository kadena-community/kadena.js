import { beforeEach, describe, expect, it } from 'vitest';
import {
  mockPrompts,
  runCommand,
  runCommandJson,
} from '../../utils/test.util.js';

describe('account list', () => {
  beforeEach(async () => {
    // Pre add the account alias file to make sure account alias exists
    await runCommand(
      'account add --type=manual --account-alias=account-one --account-name=k:55e10019549e047e68efaa18489ed785eca271642e2d0ce41d56ced2a30ccb84 --fungible=coin --network=testnet --chain-id=1 --public-keys=55e10019549e047e68efaa18489ed785eca271642e2d0ce41d56ced2a30ccb84 --quiet',
    );
    await runCommand(
      'account add --type=manual --account-alias=account-two --account-name=w:yCvUbeS6RqdKsY3WBDB3cgK-6q790xkj4Hb-ABpu3gg:keys-all --fungible=coin --network=testnet --chain-id=1 --public-keys=39710afef15243ba36007ae7aa210ab0e09682b2d963928be350e3424b5a420b,0f745a7773cbaffedcc7303b0638ffb34516aa3af98605f39dda3aeb730318c9 --quiet',
    );
  });

  it('should list all created accounts when user selects all', async () => {
    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'all',
      },
    });

    const res = await runCommandJson('account list');
    expect(res).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          alias: 'account-one.yaml',
          fungible: 'coin',
          name: 'k:55e10019549e047e68efaa18489ed785eca271642e2d0ce41d56ced2a30ccb84',
          predicate: 'keys-all',
          publicKeys: [
            '55e10019549e047e68efaa18489ed785eca271642e2d0ce41d56ced2a30ccb84',
          ],
        }),
        expect.objectContaining({
          alias: 'account-two.yaml',
          fungible: 'coin',
          name: 'w:yCvUbeS6RqdKsY3WBDB3cgK-6q790xkj4Hb-ABpu3gg:keys-all',
          predicate: 'keys-all',
          publicKeys: [
            '39710afef15243ba36007ae7aa210ab0e09682b2d963928be350e3424b5a420b',
            '0f745a7773cbaffedcc7303b0638ffb34516aa3af98605f39dda3aeb730318c9',
          ],
        }),
      ]),
    );
  });

  it('should display information for the specified account only', async () => {
    mockPrompts({
      select: {
        'Select an account (alias - account name):': 'account-one',
      },
    });

    const res = await runCommandJson('account list');
    expect(res).toEqual(
      expect.objectContaining({
        alias: 'account-one.yaml',
        fungible: 'coin',
        name: 'k:55e10019549e047e68efaa18489ed785eca271642e2d0ce41d56ced2a30ccb84',
        predicate: 'keys-all',
        publicKeys: [
          '55e10019549e047e68efaa18489ed785eca271642e2d0ce41d56ced2a30ccb84',
        ],
      }),
    );
  });

  it('should display only the specified account information via CLI', async () => {
    const res = await runCommandJson(
      'account list --account-alias=account-two --quiet',
    );
    expect(res).toEqual(
      expect.objectContaining({
        alias: 'account-two.yaml',
        fungible: 'coin',
        name: 'w:yCvUbeS6RqdKsY3WBDB3cgK-6q790xkj4Hb-ABpu3gg:keys-all',
        predicate: 'keys-all',
        publicKeys: [
          '39710afef15243ba36007ae7aa210ab0e09682b2d963928be350e3424b5a420b',
          '0f745a7773cbaffedcc7303b0638ffb34516aa3af98605f39dda3aeb730318c9',
        ],
      }),
    );
  });

  it('should return "account alias not found" when a random account alias is provided', async () => {
    const res = await runCommand(
      'account list --account-alias=some-random-account-alias',
    );

    expect(res.stderr).toContain(
      'Selected account alias "some-random-account-alias" not found.',
    );
  });
});
