<script lang="ts">
import { HalfCircleSpinner } from 'epic-spinners';
import { Pact, signWithChainweaver } from '@kadena/client';

const { VITE_KADENA_NETWORK_ID, VITE_KADENA_CHAIN_ID, VITE_KADENA_HOST } =
  import.meta.env;
const API_HOST = `https://${VITE_KADENA_HOST}/chainweb/0.0/${VITE_KADENA_NETWORK_ID}/chain/${VITE_KADENA_CHAIN_ID}/pact`;

const accountKey = (account: string): string => account.split(':')[1];

const readMessage = async (account: string): Promise<string> => {
  const transactionBuilder =
    Pact.modules['free.cka-message-store']['read-message'](account);
  const { result } = await transactionBuilder.local(API_HOST);

  if (result.status === 'success') {
    return result.data.toString();
  } else {
    console.log(result.error);
    return '';
  }
};

const writeMessage = async (
  account: string,
  messageToWrite: string,
): Promise<void> => {
  try {
    const transactionBuilder = Pact.modules['free.cka-message-store']
      ['write-message'](account, messageToWrite)
      .addCap('coin.GAS', accountKey(account))
      .addCap(
        'free.cka-message-store.ACCOUNT-OWNER',
        accountKey(account),
        account,
      )
      .setMeta(
        {
          ttl: 28000,
          gasLimit: 10000,
          chainId: VITE_KADENA_CHAIN_ID,
          gasPrice: 0.000001,
          sender: account,
        },
        VITE_KADENA_NETWORK_ID,
      );

    await signWithChainweaver(transactionBuilder);

    console.log(`Sending transaction: ${transactionBuilder.code}`);
    const response = await transactionBuilder.send(API_HOST);

    console.log('Send response: ', response);
    const requestKey = response.requestKeys[0];

    const pollResult = await transactionBuilder.pollUntil(API_HOST, {
      onPoll: async (transaction, pollRequest): Promise<void> => {
        console.log(`Polling ${requestKey}.\nStatus: ${transaction.status}`);
        console.log(await pollRequest);
      },
    });

    console.log('Polling Completed.');
    console.log(pollResult);
  } catch (e) {
    console.log(e);
  }
};

export default {
  data: () => ({
    account: '',
    messageFromChain: '',
    messageToWrite: '',
    writeInProgress: false,
  }),

  methods: {
    async readMessage() {
      this.messageFromChain = await readMessage(this.account);
    },
    async writeMessage() {
      this.writeInProgress = true;
      await writeMessage(this.account, this.messageToWrite);
      this.writeInProgress = false;
    },
  },
  components: {
    HalfCircleSpinner,
  },
};
</script>

<template>
  <main class="grid">
    <div class="card">
      <header>
        <h1 class="title">Welcome to <span>Kadena!</span></h1>
      </header>
      <p>
        This is the Kadena starter template using vuejs to help you get started
        on your blockchain development. Use the form below to interact with the
        Kadena blockchain using <code>@kadena/client</code> and edit
        <code>src/App.vue</code> to get started.
      </p>
    </div>
    <div class="card">
      <h3 class="cardTitle">Interact with the blockchain</h3>
      <section class="cardSection">
        <label for="account" class="fieldLabel">My Account</label>
        <input
          id="account"
          v-model="account"
          placeholder="Please enter a valid k:account"
        />
      </section>
      <section class="cardSection">
        <label for="write-message" class="fieldLabel">Write Message</label>
        <textarea
          id="write-message"
          v-model="messageToWrite"
          :disabled="writeInProgress || !account"
        ></textarea>
        <button
          @click="writeMessage"
          :disabled="!messageToWrite || writeInProgress"
        >
          Write
        </button>
        <half-circle-spinner
          :animation-duration="1000"
          :size="30"
          color="#ff1d5e"
          v-show="writeInProgress"
        />
      </section>
      <section class="cardSection">
        <label for="read-message" class="fieldLabel">Read Message</label>
        <textarea
          id="read-message"
          disabled
          v-model="messageFromChain"
        ></textarea>
        <button @click="readMessage" :disabled="!account">Read</button>
      </section>
    </div>
    <div class="card">
      <h3 class="cardTitle">Resources</h3>
      <a href="https://docs.kadena.io/"
        >Find in-depth information about Kadena. &rarr;</a
      >
      <a
        href="https://github.com/kadena-community/kadena.js/tree/main/packages/tools/create-kadena-app/pact"
        >The smart contract powering this page. &rarr;</a
      >
    </div>
  </main>
</template>

<style scoped>
.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 1rem;
  font-size: 1.25rem;
}

.card {
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  padding: 1.5rem;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
  width: 100%;
  max-width: 1000px;
}

.cardTitle {
  margin: 0.5rem 0;
}

.cardSection {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cardSection h4 {
  margin: 1.5rem 0;
}

.cardSection input,
.cardSection textarea {
  width: 300px;
}

header {
  text-align: center;
}

.title {
  margin: 1rem;
}

.title span {
  color: #ed098f;
}

.fieldLabel {
  margin: 1.25rem 0 0.5rem;
  font-weight: bold;
}
</style>
