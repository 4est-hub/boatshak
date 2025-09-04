'use client'

import styles from './BoatsPage.module.scss';
import { useState, useEffect, Fragment, useRef, useCallback } from 'react';
import { getBoats } from '@/services/boats';
import type { Boat } from '@/types/boat';
import BoatCardCompact from '@/app/components/BoatCardCompact/BoatCardCompact';

const BOATS_PER_PAGE = 10;

export default function Boats() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [filter, setFilter] = useState<'Show All' | 'Show Liked'>('Show All');

  const page = useRef<number>(1);
  const totalBoats = useRef<number | null>(null);
  const hasMore = useRef<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleLike = (id: string, liked: boolean) => {
    const updatedBoats = boats.map((boat: Boat) => (boat.id === id ? { ...boat, liked } : boat));
    setBoats(updatedBoats);
  };

  const fetchBoats = async () => {
    if (!hasMore.current) return;

    try {
      const response = await getBoats(page.current, BOATS_PER_PAGE);
      setBoats(prev => [...prev, ...response.data]);
      totalBoats.current = response.total;

      if (response.data.length === 0 || boats.length + response.data.length >= response.total) {
        hasMore.current = false;
      }
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      } else {
        throw new Error('unknown fetchBoats error');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchMoreBoats = () => {
    if (loadingMore || !hasMore.current) return;
    setLoadingMore(true);
    page.current += 1;
    fetchBoats();
  };

  useEffect(() => {
    setLoading(true);
    fetchBoats();
  }, []);

  // IntersectionObserver setup
  const bottomRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreBoats();
      }
    });

    if (node) observer.current.observe(node);
  }, [loadingMore]);

  const filterdBoats = boats.filter(boat => (filter === 'Show Liked' ? boat.liked : true));

  if (loading) return 'Loading...';

  return (
    <main className={styles.container}>
      {/* left column */}
      <section className={styles.listings}>
        <div className='filters'>
          <button onClick={() => setFilter('Show All')}>Show All</button>
          <button onClick={() => setFilter('Show Liked')}>Show Liked</button>
        </div>

        {filterdBoats.map(boat => (
          <Fragment key={boat.id}>
            <BoatCardCompact boat={boat} handleLike={handleLike} />
          </Fragment>
        ))}

        {hasMore.current && (
          <div ref={bottomRef} style={{ height: '1px' }}>
            {loadingMore && 'Loading More...'}
          </div>
        )}
      </section>
      {/* right column */}
      <section>Map?</section>
    </main>
  );
}
