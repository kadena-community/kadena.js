import { removeImageInfoFromMarkdown } from '../removeImageInfoFromMarkdown';

describe('utils removeImageInfoFromMarkdown', () => {
  it('should return the normal markdown string', () => {
    const markdown =
      "Verify other <b>accounts</b> can't update your module You've seen that you can use your account to deploy and update the election module on the local development network. You might also want to verify that no other <b>accounts</b> can make changes to your deployed module. To verify that other <b>accounts</b> can't...";
    const expectedResult =
      "Verify other <b>accounts</b> can't update your module You've seen that you can use your account to deploy and update the election module on the local development network. You might also want to verify that no other <b>accounts</b> can make changes to your deployed module. To verify that other <b>accounts</b> can't...";
    expect(removeImageInfoFromMarkdown(markdown)).toEqual(expectedResult);
  });
  it('should return the markdown without any image info', () => {
    const markdown =
      '<b>Account</b> Set-up: Trust Wallet, mobile wallet, 5 screens ![Download the Trust Wallet app, select “Create a new wallet”](/assets/blog/2019/0_YulQYZXmD8iDgVjd.png) ![Accept responsibility for securing your recovery phrase](/assets/blog/2019/0_kZbr473spQ1dUAah.png) ![Privately record and secure the 12 recovery...';
    const expectedResult =
      '<b>Account</b> Set-up: Trust Wallet, mobile wallet, 5 screens   ![Privately record and secure the 12 recovery...';
    expect(removeImageInfoFromMarkdown(markdown)).toEqual(expectedResult);
  });
});
