import Image from 'next/image'
import styles from './header.module.css'
import { Button } from '../Button';

export const Header = () => {
  return (
    <header className={`${styles.header} container-inner`}>
      <Image
        className={styles.logo}
        src="/marmalade.svg"
        alt="Marmalade"
        width={285}
        height={55}
        priority
      />
      <nav className={styles.nav}>
        <ul className={styles['nav-items']}>
          <li>Ask me anything</li>
          <li>Docs</li>
        </ul>
        {/* <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul> */}
        <Button href="https://github.com/kadena-io/marmalade/tree/v2">Github</Button>
      </nav>
    </header>
  );
};