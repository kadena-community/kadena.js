import { getBalance } from '@kadena/client-utils/coin';

const button = document.getElementById('get');
const $account = document.getElementById('accountInput');
const $chain = document.getElementById('chainInput');
const $network = document.getElementById('networkInput');
const $output = document.getElementById('output');

setTimeout(() => {
  // initial values
  $account.value =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
  $chain.value = '2';
  $network.value = 'testnet04';
}, 100);

const getAccount = () => $account.value;
const getChain = () => $chain.value;
const getNetwork = () => $network.value;

function writeOutput(output) {
  const el = document.createElement('div');
  el.innerText = output;
  $output.appendChild(el);
}

async function main() {
  button.addEventListener('click', async (e) => {
    const [account, network, chain] = [getAccount(), getNetwork(), getChain()];
    const bal = await getBalance(account, network, chain);
    writeOutput(`${account}(${network}:${chain}): ${bal}`);
  });
}

main().catch(console.error);
