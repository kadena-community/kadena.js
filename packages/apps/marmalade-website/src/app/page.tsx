import { Header } from './components/Header'
import Image from 'next/image'
import styles from './page.module.css'
import { Button } from './components/Button'

export default function Home() {
  return (
    <>
      <div className={styles['hero-section']}>
        <Header></Header>
        <div className="container-inner">
          <h1>NFT Marketplace infrastructure</h1>
          <p>Marmalade on <strong>Kadena</strong> provides the complete infrastructure to launch and run game-changing NFT marketplaces.</p>
          <Button href="https://google.com">Default button</Button>
          <Button href="https://google.com" type="primary" color="green"><strong>Primary green </strong> Button</Button>
          <Button href="https://google.com" type="secondary" color="orange">Secondary orange</Button>
        </div>
      </div>
      <main className={styles.main}>
        <section className={styles['section-dark-green']}>
          <div className="container-inner">
            <h2 className="green">Stackable Policies</h2>
            <p className={styles.description}>With Marmalade's groundbreaking, unique feature, you now can stack unlimited policies per token!</p>
          </div>
        </section>
        <section className={styles['section-green']}>
          <div className="container-inner">
            <h2 className="green">Policies per Purpose</h2>
            <p className={styles.description}>Lorem ipsum d quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </section>
        <section>
          <div className="container-inner">
            <h2>Metadata Standards</h2>
            <p className={styles.description}>Lorem ipsum dolor sit amet, comagna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
        </section>

        <div>
          <p>
            Test code 
            <code className={styles.code}>src/app/page.tsx</code>
          </p>
        </div>
      </main>
    </>
  )
}
