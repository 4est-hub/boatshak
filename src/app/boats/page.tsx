'use client'

import styles from './BoatsPage.module.scss';
import { useState, useEffect, Fragment } from 'react';
import { getBoats } from '@/services/boats';
import type { Boat } from '@/types/boat';
import BoatCard from '@/app/components/BoatCard/BoatCard';

export default function Boats() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'Show All' | 'Show Liked'>('Show All');

  useEffect(() => {
    setLoading(true);

    const fetchBoats = async () => {
      try {
        const response = await getBoats();
        setBoats(response);
      } catch(e) {
        if (e instanceof Error) {
          throw new Error(e.message);
        } else {
          throw new Error('unknown fetchBoats error');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBoats();
  }, [])

  const handleLike = (id: string, liked: boolean) => {
    const updatedBoats = boats.map((boat: Boat) => (boat.id === id ? {...boat, liked: liked} : boat));
    setBoats(updatedBoats);
  };

  const filterdBoats = boats.filter((boat) => (filter === 'Show Liked' ? boat.liked : true));

  if (loading) return 'Loading...';

  return (
    <main className={styles.container}>
      <section className='filters'>
        <button onClick={() => setFilter('Show All')}>Show All</button>
        <button onClick={() => setFilter('Show Liked')}>Show Liked</button>
      </section>
      { filterdBoats.map((boat) => (
        <Fragment key={boat.id}>
          <BoatCard boat={boat} handleLike={handleLike} />
        </Fragment>
      ))}
    </main>
  );
}