import { createScript } from '@kadena/toolbox';

export default createScript({
  autoStartNetwork: true,
  async run({ client, args }) {
    const isDeployed = await client.isContractDeployed('free.hello-world');
    const s = await client.deployContract('hello-world.pact', {
      upgrade: isDeployed,
    });
    console.log(s);
  },
});
