import type { Boat } from '@/types/boat';
import styles from './BoatCard.module.scss';

interface Props {
  boat: Boat;
  handleLike: (id: string, like: boolean) => void;
}

export default function BoatCard({ boat, handleLike }: Props) {
  const { id, img, title, price, sellerType, liked } = boat;

  return (
    <div className={styles.card}>
      <img className={styles.image} src={img} alt={title} />
      <div className={styles.title}>{title}</div>
      <div className={styles.price}>${price.toLocaleString()}</div>
      <div className={styles.seller}>{sellerType}</div>
      <div className={styles.likeSection}>
        <button onClick={() => handleLike(id, !liked)}>
          {liked ? 'Unlike' : 'Like'}
        </button>
        <span className={liked ? styles.liked : ''}>
          {liked ? 'Liked' : 'Not Liked'}
        </span>
      </div>
    </div>
  );
}
