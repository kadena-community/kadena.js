import { assertIsConfirmationDialog, installSnap } from '@metamask/snaps-jest';
import { getAccounts } from './helpers/test-utils';
import { divider, panel, text } from '@metamask/snaps-ui';

describe('kda_signTransaction', () => {
  it('should get the signature of a transaction', async () => {
    const { request } = await installSnap();

    const accounts = await getAccounts(request);

    const response = request({
      method: 'kda_signTransaction',
      params: {
        id: accounts[0].id,
        transaction: `{"payload":{"exec":{"code":"(coin.transfer-create \\"k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7\\" \\"k:10a3f4a9e5317c8dba58435dfdd4121bd3e4b0483993e67b65bea9c3c1113af4\\" (read-keyset \\"ks\\") 0.100000000000)","data":{"ks":{"keys":["10a3f4a9e5317c8dba58435dfdd4121bd3e4b0483993e67b65bea9c3c1113af4"],"pred":"keys-all"}}}},"nonce":"kjs:nonce:1699369566001","signers":[{"pubKey":"62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7","scheme":"ED25519","clist":[{"name":"coin.TRANSFER","args":["k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7","k:10a3f4a9e5317c8dba58435dfdd4121bd3e4b0483993e67b65bea9c3c1113af4",{"decimal":"0.1"}]},{"name":"coin.GAS","args":[]}]}],"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7","ttl":28800,"creationTime":1699369566,"chainId":"1"},"networkId":"mainnet01"}`,
      },
    });

    const ui = await response.getInterface({ timeout: 50000 });

    // creationTime + ttl
    const expires =new Date(1699398366000).toLocaleString()
    expect(ui).toRender(
      panel([
      text('Transaction signature request'),
        divider(),
        text('**APPROVING (1/2)**'),
        text('Send: 0.1 KDA'),
        text('From:'),
        text('k:62bb7cf156ccfbe17bd6ca5460098ca9398a4aa3f04bd617f7a721b6e2e5aac7 (Kadena Account 1) (chain 1)'),
        text('To:'),
        text('k:10a3f4a9e5317c8dba58435dfdd4121bd3e4b0483993e67b65bea9c3c1113af4 (chain 1)'),
        divider(),
        text('**APPROVING (2/2)**'),
        text("Gas spend:"),
        text("Up to 0.000025 KDA"),
        divider(),
        text('Transaction lifetime:'),
        text(`**Expired** (expires ${expires})`),
        text('⚠️  Transaction already expired'),
      ])
    );
    assertIsConfirmationDialog(ui);
    await ui.ok();

    expect(await response).toRespondWith(
      'd51f64d0837faff9349ae877a19ea4d8d85f2c979d67294f32564bcbdbf79b449e80d3e132e21456c399096b1613f794b23e9e87d50238e78e457cbb755ef503',
    );
  });

  it('should throw an expection when payload is wrong', async () => {
    const { request } = await installSnap();

    const accounts: any = await request({
      method: 'kda_getAccounts',
    });

    const response = await request({
      method: 'kda_signTransaction',
      params: {
        id: accounts.response.result[0].id,
        transaction: `{"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"k:599b9ccec365e813031b49a558d86f66e9bb210084cea4f59f57c91bd454f0f8","ttl":28800,"creationTime":1699369566,"chainId":"1"},"networkId":"mainnet01"}`,
      },
    });

    const responseString = JSON.stringify(response);
    expect(responseString.includes('error')).toBe(true);
    expect(responseString.includes(`"code":-32603`)).toBe(true);
  });
});
