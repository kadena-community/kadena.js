import { execSync } from 'child_process';
import { describe, expect, it } from 'vitest';

describe('decrypt command', () => {
  it('should decrypt a message correctly', () => {
    const keyMessage =
      'STBjVU02cmFVV1UvNkUvei9wOGhOUT09Lm00RS8yWGlHeisraUZNMkEuNjhzMGk0UlBKcFRRc1ptOVhCMlFxQT09Lmk0NjEwbDVUYWd0TmVMMWhNM2xvTHIzNmMyam5CTDBDUUFyNXZjbldxWFJhOXRoa25MSnFUc3VmWEdoWnVNMkVRWFpmbEpYcnh2Y1cwK0p2NXpjeDlRPT0=';
    const password = '12345678';

    let output;
    try {
      output = execSync(
        `node bin/kadena-cli.js keys decrypt --key-message ${keyMessage} --security-current-password ${password}`,
      ).toString();
    } catch (error) {
      output = error.stdout.toString();
    }

    console.log(output);
    expect(output).toContain(
      '786aeb505f3dd734d2acd25846816dc0d5f975474a391f4190400c4f4ccb57aab50fd5612de8edaf35c3a01b0a9c564c2e216cfb512591639c5e901d55f2363f',
    ); // Assert the expected output
  });

  it('should not decrypt a message when password is wrong', () => {
    const keyMessage =
      'STBjVU02cmFVV1UvNkUvei9wOGhOUT09Lm00RS8yWGlHeisraUZNMkEuNjhzMGk0UlBKcFRRc1ptOVhCMlFxQT09Lmk0NjEwbDVUYWd0TmVMMWhNM2xvTHIzNmMyam5CTDBDUUFyNXZjbldxWFJhOXRoa25MSnFUc3VmWEdoWnVNMkVRWFpmbEpYcnh2Y1cwK0p2NXpjeDlRPT0=';
    const password = 'wrong';

    let output;
    try {
      output = execSync(
        `node bin/kadena-cli.js keys decrypt --key-message ${keyMessage} --security-current-password ${password}`,
      ).toString();
    } catch (error) {
      console.log('error: ', error);
      output = error.stdout.toString();
    }

    console.log(output);
    // expect(output).toContain(
    //   '786aeb505f3dd734d2acd25846816dc0d5f975474a391f4190400c4f4ccb57aab50fd5612de8edaf35c3a01b0a9c564c2e216cfb512591639c5e901d55f2363f',
    // ); // Assert the expected output
  });
});
