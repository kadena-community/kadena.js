<script lang="ts">
import { HalfCircleSpinner } from 'epic-spinners';
import writeMessage from './utils/writeMessage';
import readMessage from './utils/readMessage';

export default {
  data: () => ({
    account: '',
    messageFromChain: '',
    messageToWrite: '',
    writeInProgress: false,
  }),

  methods: {
    async readMessage() {
      this.messageFromChain = await readMessage({ account: this.account });
    },
    async writeMessage() {
      this.writeInProgress = true;
      await writeMessage({
        account: this.account,
        messageToWrite: this.messageToWrite,
      });
      this.writeInProgress = false;
      this.messageToWrite;
    },
  },
  components: {
    HalfCircleSpinner,
  },
};
</script>

<template>
  <main class="grid">
    <section class="headerWrapper">
      <div class="header">
        <img
          src="../public/assets/k-community-icon.png"
          alt="Kadena Logo"
          class="logo"
        />
        <h1 class="title">Start Interacting with the Kadena Blockchain</h1>
        <p class="note">
          This is the Kadena starter template using <strong>Vue JS</strong>
          to help you get started on your blockchain development.
        </p>
        <p class="note">
          Use the form below to interact with the Kadena blockchain using
          <code>@kadena/client</code> and edit
          <code>src/pages/index.tsx</code> to get started.
        </p>
      </div>
    </section>
    <section class="contentWrapper">
      <div class="blockChain">
        <div class="card">
          <h4 class="cardTitle">Write to the blockchain</h4>
          <fieldset class="fieldset">
            <label for="account" class="fieldLabel">My Account</label>
            <input
              id="account"
              v-model="account"
              placeholder="Please enter a valid k:account"
              class="input codeFont"
            />
          </fieldset>
          <fieldset class="fieldset">
            <label for="write-message" class="fieldLabel">Write Message</label>
            <textarea
              id="write-message"
              v-model="messageToWrite"
              :disabled="writeInProgress || !account"
              class="input"
            ></textarea>
          </fieldset>
          <div class="buttonWrapper">
            <half-circle-spinner
              :animation-duration="1000"
              :size="30"
              color="#ff1d5e"
              v-show="writeInProgress"
            />
            <button
              @click="writeMessage"
              :disabled="!messageToWrite || writeInProgress"
              class="button"
            >
              Write
            </button>
          </div>
        </div>
        <div class="card">
          <h4 class="cardTitle">Read from the blockchain</h4>
          <fieldset class="fieldset">
            <label for="read-message" class="fieldLabel">Read Message</label>
            <textarea
              id="read-message"
              disabled
              v-model="messageFromChain"
              class="input"
            ></textarea>
          </fieldset>
          <div class="buttonWrapper">
            <button @click="readMessage" :disabled="!account">Read</button>
          </div>
        </div>
      </div>
      <div class="helperSection">
        <div class="card noBackground">
          <h4 class="cardTitle">Resources</h4>
          <ul class="list">
            <li>
              <a href="https://docs.kadena.io/" class="link"
                >Find in-depth information about Kadena. &rarr;</a
              >
            </li>
            <li>
              <a
                class="link"
                href="https://github.com/kadena-community/kadena.js/tree/main/packages/tools/create-kadena-app/pact"
                >The smart contract powering this page. &rarr;
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.logo {
  height: 64px;
  width: 64px;
}

.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.headerWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background-color: #000;
  width: 100%;
  color: #fff;
  padding: 40px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 768px;
  text-align: center;
  gap: 24px;
}

.title {
  font-size: 40px;
  line-height: 48px;
  font-weight: 700;
  letter-spacing: 1px;
  max-width: 475px;
  margin: 0 auto;
}

.note {
  text-align: center;
  font-size: 22px;
  font-style: normal;
  font-weight: 200;
  line-height: 1.5;
}

.contentWrapper {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 58px 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.blockChain {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
  width: 100%;
}

.card {
  background-color: #f8f8f8;
  border-radius: 8px;
  display: flex;
  padding: 16px 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  flex-grow: 1;
}

.noBackground {
  background-color: transparent;
}

.cardTitle {
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 40px;
}

.fieldset {
  border: 0;
  outline: 0;
  display: flex;
  padding: 4px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  height: 100%;
}

.fieldLabel {
  color: #080708;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  display: flex;
}

.input {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  border: 0;
  outline: 0;
  display: flex;
  height: 40px;
  padding: 8px 16px;
  align-items: center;
  gap: 16px;
  border-radius: 4px;
  background: #fff;
  width: 100%;
  color: #080708;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  box-shadow: 0px 1px 0 0 #cacbce;
  flex-grow: 1;
}

.codeFont {
  font-family: 'Kode Mono', monospace;
}

.buttonWrapper {
  display: flex;
  padding: 2px;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

.button {
  border-radius: 4px;
  background: #320052;
  padding: 8px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #e7c2ff;
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  outline: 0 none;
  border: 0 none;
}

.button:hover {
  background: #6400a3;
  color: #f7ebff;
}

.button:disabled {
  background: #f7ebff;
  color: #a59daa;
}

.list {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 8px;
}

.list li::marker {
  color: #00498f;
}

.link {
  color: #00498f;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
}

.link:hover {
  text-decoration: none;
}
</style>
