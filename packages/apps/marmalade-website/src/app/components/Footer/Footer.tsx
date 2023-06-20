import Image from 'next/image'
import styles from './footer.module.css'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Image
        src="/icon.svg"
        alt="Marmalade"
        width={80}
        height={80}
      />
      <p>Footer</p>
    </footer>
  );
};