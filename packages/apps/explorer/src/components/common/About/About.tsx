import s from './About.module.css';

import React, { FC } from 'react';

const About: FC = () => (
  <div className={s.aboutContainer}>
    <div>
      <h2 className={s.header}>What is the Kadena Block Explorer?</h2>
      <p>
        Block Explorer is an analytics tool for the Kadena platform which
        visualizes the mining, propagation and braiding of blocks across
        multiple Kadena chains in real time and allows you to search for
        transactions and explore the contents of blocks.
      </p>
      <h2 className={s.header}>How to find transactions and explore blocks</h2>
      <p>
        The front page of the block explorer only shows recent network activity.
        However, there are many ways to search the entire blockchain.
      </p>
      <p>
        <b>Request Key: </b>Enter a transaction’s Request Key in the search bar.
        These are often provided by crypto wallets as a means to confirm that
        the transaction is in the blockchain.
      </p>
      <p>
        <b>Code: </b>In the search bar, toggle the dropdown from Request Key to
        Code. Use this to return a list of all transactions whose code appears
        in your query.
      </p>
      <p>Code search examples:</p>
      <ul className={s.ulRow}>
        <li>
          Enter an account name to return transfers in which it has participated
          — i.e.
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          "8cc8da8ea7cbfaf6510dbc5f402b025dceaa9a3eaf7145e0ba933d468b63d358"
        </li>
        <li>
          Enter a function to return all top-level calls — i.e.
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          "coin.transfer-crosschain"
        </li>
        <li>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Enter "module" to return all transactions which deployed smart
          contracts
        </li>
        <li>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Enter "189.6" to return all transactions which transferred that amount
          of KDA
        </li>
      </ul>
      <p className={s.ulRow}>
        <b>Block: </b>Search for a specific block by entering its Chain ID and
        Block Height into the following URL format:
        https://explorer.chainweb.com/mainnet/chain/[X]/height/[Y] — replace [X]
        with Chain ID, replace [Y] with Block Height
      </p>
      <h2 className={s.header}>Why Kadena has multiple chains</h2>
      <p>
        The Kadena Public Blockchain runs a protocol called Chainweb, a novel
        parallel-chain Proof of Work architecture comprised of braided chains
        that all mine the same native currency and transfer liquidity between
        each other.
      </p>
      <p>
        In Chainweb, the braided chains incorporate Merkle proofs from adjacent
        chains in a fixed graph layout that ensures that proofs quickly
        propagate to every other chain in the system within some maximum block
        depth.
      </p>
      <p>
        Hover your cursor over any block to highlight the neighbor chains that
        are cryptographically linked to it. In this 10 chain configuration,
        notice that all 10 chains become braided together within the height of
        two blocks.
      </p>
      <p>
        By linking multiple chains together in this manner, Kadena offers
        massive throughput and enhanced security.
      </p>
    </div>
  </div>
);

export default About;
