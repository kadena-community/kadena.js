import { Pact, createClient, isSignedTransaction } from '@kadena/client';
import { KadenaSpireKey } from './spirekey';

function setupEventListeners({
  loginButton,
  loginOptimisticButton,
  signButton,
  logoutButton,
  messageInput,
  spireKey,
}: {
  loginButton: HTMLElement;
  loginOptimisticButton: HTMLElement;
  signButton: HTMLElement;
  logoutButton: HTMLElement;
  messageInput: HTMLInputElement;

  spireKey: KadenaSpireKey;
}) {
  loginOptimisticButton?.addEventListener('click', () => {
    spireKey.loginOptimistic();
  });

  loginButton?.addEventListener('click', () => {
    spireKey.login();
  });

  signButton?.addEventListener('click', () => {
    spireKey.sign(createHelloTransaction(messageInput.value, spireKey));
  });

  logoutButton.addEventListener('click', () => {
    spireKey.logout();
  });
}

async function main({ spireKey }: { spireKey: KadenaSpireKey }) {
  const { local, submitOne } = createClient(({ chainId, networkId }) => {
    if (networkId === 'testnet04') {
      return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    } else {
      return `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
    }
  });

  setupEventListeners({
    loginButton: document.getElementById('loginButton')!,
    loginOptimisticButton: document.getElementById('loginOptimisticButton')!,
    signButton: document.getElementById('signButton')!,
    logoutButton: document.getElementById('logoutButton')!,
    messageInput: document.getElementById('messageInput') as HTMLInputElement,
    spireKey,
  });

  const loginSection = document.getElementById('loginSection')!;
  const appSection = document.getElementById('appSection')!;
  const sendSection = document.getElementById('sendSection')!;

  if (spireKey.isLoggedIn) {
    loginSection.style.display = 'none';
    appSection.style.display = 'block';
    sendSection.style.display = 'block';
    if (Object.keys(spireKey.transactions).length > 0) {
      const sendList = document.getElementById('sendList')!;
      for (const hash of Object.keys(spireKey.transactions)) {
        const transaction = spireKey.transactions[hash];
        const li = document.createElement('li');
        const sendButton = document.createElement('button');
        sendButton.innerText = 'Test';
        li.appendChild(sendButton);
        const code = document.createElement('pre');
        code.textContent = insertNewLineAtLength(
          JSON.stringify(transaction, null, 2),
        );
        li.appendChild(code);
        const errorField = document.createElement('div');
        errorField.className = 'error';

        sendButton.addEventListener('click', async () => {
          errorField.remove();
          if (isSignedTransaction(transaction)) {
            const res = await local(transaction).catch(
              (err) => (errorField.textContent = err.message),
            );
            li.appendChild(errorField);
          }
        });
        sendList.appendChild(li);
      }
    }
  } else {
    loginSection.style.display = 'block';
    appSection.style.display = 'none';
    sendSection.style.display = 'none';
  }

  const walletNameElement = document.getElementById('walletName')!;
  const accountNameElement = document.getElementById('accountName')!;
  walletNameElement.textContent = spireKey.user?.alias || 'unknown';
  accountNameElement.textContent = spireKey.user?.accountName || 'unknown';
}

const spireKey = new KadenaSpireKey(
  'https://spirekey.kadena.io',
  location.origin,
);

main({
  spireKey,
}).catch(console.error);

function createHelloTransaction(message: string, spireKey: KadenaSpireKey) {
  return Pact.builder
    .execution((Pact.modules as any)['free']['hello-world']['here'](message))
    .addSigner(
      {
        pubKey: spireKey.user!.credentials[0].publicKey,
        scheme: 'WebAuthn',
      } as any,
      (signFor: any) => [
        signFor('free.hello-world-gas-station.GAS_PAYER', [
          'hi',
          { int: 1 },
          1.0,
        ]),
      ],
    )
    .setNetworkId('testnet04')
    .setMeta({
      chainId: '0',
      senderAccount: 'hw-gas-payer',
      creationTime: Math.round(new Date().getTime() / 1000) - 15,
      ttl: 28800,
      gasLimit: 10000,
      gasPrice: 1e-8,
    })
    .createTransaction();
  /*
    {
      networkId: 'mainnet01',
      pactCode: `(free.hello-world.here ${JSON.stringify(user)})`,
      keyPairs: [
        {
          publicKey: kp.publicKey,
          secretKey: kp.secretKey,
          clist: [
            //capability to use gas station
            {
              name: `free.hello-world-gas-station.GAS_PAYER`,
              args: ['hi', { int: 1 }, 1.0],
            },
          ],
        },
      ],
      meta: Pact.lang.mkMeta(
        'hw-gas-payer',
        '0',
        GAS_PRICE,
        GAS_LIMIT,
        creationTime(),
        28800,
      ),
    }
  */
}

function insertNewLineAtLength(str: string) {
  const screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const charWidth = 8.8; // Assuming an average character width of 8 pixels
  const maxChars = Math.floor(screenWidth / charWidth);

  const regex = new RegExp(`.{1,${maxChars}}(?=[{[\w])`, 'g');
  return str.match(regex)?.join('\n')!;
}
