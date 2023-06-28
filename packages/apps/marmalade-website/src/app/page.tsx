import { Header } from './partials/Header'
import { PolicyCustomizer } from './partials/PolicyCustomizer'
import { Button } from './components/Button'
import { Card } from './components/Card'
import { VerticalTabs } from './components/VerticalTabs'
import styles from './page.module.css'

import React from 'react';
import { Code } from './components/Code'

export default function Home() : JSX.Element {

  const contentPoliciesPerPurpose = [
    {
      title: 'Migration policy',
      description: 'Token migration from v1 to v2',
      content: (
        <>
          <h3 className="color-light">Extra policies</h3>
          <p className={styles.description}>Extra immutable or adjustable policies based on your business-model needs.
            These extra policies can be used to fit your use-case.</p>
          <Button href="https://alpha-docs.kadena.io/" type="primary" color="green">
            <strong>Extra policies</strong> docs
          </Button>
        </>
      ),
    },
    {
      title: 'Onchain-manifest policy',
      description: 'Allows v1 method of on-chain manifest',
      content: (
        <>
          <h3 className="color-light">Content title 2</h3>
          <p className={styles.description}>Content 2</p>
          <Button href="https://alpha-docs.kadena.io/" type="primary" color="green">
            Test
          </Button>
        </>
      ),
    },
    {
      title: 'Fixed-issuance policy',
      description: 'Fractional NFT',
      content: (
        <>
          <h3 className="color-light">Content title 3</h3>
          <p className={styles.description}>Content 3</p>
          <Button href="https://alpha-docs.kadena.io/" type="primary" color="green">
            Test
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className={styles['hero-section']}>
        <Header></Header>
        <div className="container-inner">
          <h1>NFT Marketplace infrastructure</h1>
          <p>Marmalade on <strong>Kadena</strong> provides the complete infrastructure to launch and run game-changing NFT marketplaces.</p>
        </div>
      </div>
      <main className={styles.main}>
        <section className={styles['section-dark-green']}>
          <div className="container-inner">
            <h2 className="color-green">Stackable Policies</h2>
            <div className="grid">
              <Card title="Collection" buttonColor="orange" buttonText="Policy added" />
              <Card title="Royalty" buttonColor="green" buttonText="Adding Policy ..." />
              <Card title="Guard" buttonColor="dark-green" buttonText="Add Policy" />
              <Card title="Guard" buttonColor="dark-green" buttonText="Add Policy" />
              <Card title="Guard" buttonColor="dark-green" buttonText="Add Policy" />
            </div>
            <p className={styles.description}>With Marmalade&apos;s groundbreaking, unique feature, you now can stack unlimited policies per token!</p>
            <PolicyCustomizer />
          </div>
        </section>
        <section className={styles['section-green']}>
          <div className="container-inner">
            <h2 className="color-green">Policies per Purpose</h2>
            <VerticalTabs tabs={contentPoliciesPerPurpose} />
          </div>
        </section>
        <section>
          <div className="container-inner">
            <h2>Compatibility + Use cases</h2>
            <p className={styles.description}>Lorem ipsum dolor sit amet, comagna aliqua.</p>
            <Code color="orange">
              {`{`}<br/>
              &nbsp;&nbsp; {`"description": "Genenis Blockchain Print NYT",`}<br/>
              &nbsp;&nbsp; {`"external_url": "https://www.marmalade.io/id/123",`}<br/>
              &nbsp;&nbsp; {`"image": "https://cdn.marmalade.io/assets/id/123.png",`}<br/>
              &nbsp;&nbsp; {`"attributes": [...]`}<br/>
              {`}`}
            </Code>
          </div>
        </section>
        {/* <Icon name="chemical-weapon" color="orange" size="lg" /> */}
      </main>
    </>
  )
}
