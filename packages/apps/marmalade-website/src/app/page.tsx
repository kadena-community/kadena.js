import { Button } from './components/Button'
import { Card } from './components/Card'
import { Code } from './components/Code'
import { Icon } from './components/Icon'
import { VerticalTabs } from './components/VerticalTabs'
import { Builders } from './partials/Builders'
import { Header } from './partials/Header'
import { PolicyCustomizer } from './partials/PolicyCustomizer'
import styles from './page.module.scss'

import React from 'react';

export default function Home() : JSX.Element {

  const contentPoliciesPerPurpose = [
    {
      title: 'Fixed-issuance policy',
      description: 'Fractional NFT',
      content: (
        <>
          <h3>Content title 3</h3>
          <p>Content 3</p>
          <Button href="https://alpha-docs.kadena.io/" type="primary" color="green">
            Lorem ipsum
          </Button>
        </>
      ),
    },
    {
      title: 'Onchain-manifest policy',
      description: 'Allows v1 method of on-chain manifest',
      content: (
        <>
          <h3>Content title 2</h3>
          <p>Content 2</p>
          <Button href="https://alpha-docs.kadena.io/" type="primary" color="green">
            Lorem ipsum
          </Button>
        </>
      ),
    },
    {
      title: 'Migration policy',
      description: 'Token migration from v1 to v2',
      content: (
        <>
          <h3>Extra policies</h3>
          <p>Extra immutable or adjustable policies based on your business-model needs.
            These extra policies can be used to fit your use-case.</p>
          <Button href="https://alpha-docs.kadena.io/" type="primary" color="green">
            <strong>Extra policies</strong> docs
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
          <p className={styles['hero-desc']}>
            Marmalade on <strong>Kadena</strong> provides the complete infrastructure to launch and 
            run game-changing NFT marketplaces.
          </p>
        </div>
      </div>
      <main className={styles.main}>
        <section className={styles['section-dark-green']}>
          <div className="container-inner">
            <h2>Plugable Features</h2>
            <PolicyCustomizer />
          </div>
        </section>
        <section className={styles['section-green']}>
          <div className="container-inner">
            <h2>Policies for every Use-Case</h2>
            <div className="container-small">
              <VerticalTabs tabs={contentPoliciesPerPurpose} />
              <div className="grid">
                <div className="content-block">
                  <h3>Lorem ipsum</h3>
                  <p>Extra immutable or adjustable policies based on your business-model needs.
                    These extra policies can be used to fit your use-case.</p>
                  <Button href="https://alpha-docs.kadena.io/" type="primary" color="green">
                    <strong>Extra policies</strong> docs
                  </Button>
                </div>
                <Card title="My Policy" buttonColor="orange" buttonText="Deploy policy" />
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container-inner">
            <h2>Compatibility + Use cases</h2>
            <p className={styles.description}>Lorem ipsum dolor sit amet, comagna aliqua.</p>
            <div className="grid">
              <div>
                <Code color="orange">
                  {`{`}<br/>
                  {`"description": "Genenis Blockchain Print NYT",`}<br/>
                  {`"external_url": "https://www.marmalade.io/id/123",`}<br/>
                  {`"image": "https://cdn.marmalade.io/assets/id/123.png",`}<br/>
                  {`"attributes": [...]`}<br/>
                  {`}`}
                </Code>
              </div>
              <div className="content-block">
                <h3>Lorem ipsum</h3>
                <p>Extra immutable or adjustable policies based on your business-model needs.
                  These extra policies can be used to fit your use-case.</p>
                <Button href="https://alpha-docs.kadena.io/" type="primary" color="orange">
                  <strong>Custom policies creation</strong> docs
                </Button>
              </div>  
            </div>
          </div>
        </section>
        <section className={styles['section-dark-orange']}>
          <div className="container-inner">
            <h2>Developer Tools</h2>
            <p className={styles.description}>Lorem ipsum</p>
            <div className="grid">
              <div>
                <Icon name="lock" color="orange" size="lg" />
                <p>Lorem ipsum dolor sit</p>
              </div>
              <div>
                <Icon name="chemical-weapon" color="orange" size="lg" />
                <p>Lorem ipsum dolor sit</p>
              </div>
              <div>
                <Icon name="translate-variant" color="orange" size="lg" />
                <p>Lorem ipsum dolor sit</p>
              </div>
            </div>
          </div>
        </section>
        <section className={styles['section-orange']}>
          <div className="container-inner">
            <Builders />
          </div>
        </section>
      </main>
    </>
  )
}
