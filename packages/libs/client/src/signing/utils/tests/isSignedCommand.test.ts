import { isSignedCommand } from '../isSignedCommand';

describe('isSignedCommand', () => {
  it('returns true if command is signed', () => {
    const command = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [{ sig: 'sig' }],
    };
    expect(isSignedCommand(command)).toBe(true);
  });

  it('returns false if command is not signed', () => {
    const command = {
      cmd: 'cmd',
      hash: 'hash',
      sigs: [undefined],
    };
    expect(isSignedCommand(command)).toBe(false);
  });
});
