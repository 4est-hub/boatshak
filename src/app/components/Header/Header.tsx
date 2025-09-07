import Link from 'next/link';
import styles from './Header.module.scss';

const LogoDesign = () => (
  <h1 className={styles.logo}>
    <Link href="/" aria-label="BoatShak logo">
      <span className={styles.boat}>Boat</span>
      <span className={styles.shak}>Shak</span>
    </Link>
  </h1>
);

export default function Header() {
  return (
    <header className={styles.container}>
      <LogoDesign />
    </header>
  );
}
