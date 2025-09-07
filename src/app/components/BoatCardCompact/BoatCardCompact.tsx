import type { Boat } from '@/types/boat';
import styles from './BoatCardCompact.module.scss';
import Image from 'next/image';

interface Props {
  boat: Boat;
  handleLike: (id: string, like: boolean) => void;
}

export default function BoatCardCompact({ boat, handleLike }: Props) {
  const { id, img, title, price, sellerType, liked } = boat;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={img}
          alt={title}
          width={400}
          height={200}
          priority={true}
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.seller}>{sellerType}</div>
        <button
          className={styles.like}
          onClick={() => handleLike(id, !liked)}
        >
          {liked ? 'Unlike' : 'Like'}
        </button>
        <div className={styles.price}>${price.toLocaleString()}</div>
      </div>
    </article>
  );
}
