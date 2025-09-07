'use client'

import styles from './BoatsPage.module.scss';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getBoats } from '@/services/boats';
import type { Boat } from '@/types/boat';
import BoatCardCompact from '@/app/components/BoatCardCompact/BoatCardCompact';
import Button from '@/app/components/ui/Button/Button';

const BOATS_PER_PAGE = 10;

export default function Boats() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'Show All' | 'Show Liked'>('Show All');

  const page = useRef<number>(1);
  const hasMore = useRef<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const handleLike = (id: string, liked: boolean) => {
    const updatedBoats = boats.map((boat: Boat) => (boat.id === id ? { ...boat, liked } : boat));
    setBoats(updatedBoats);
  };

  const fetchBoats = useCallback(async () => {
    if (!hasMore.current) return;

    setLoading(true);

    try {
      const response = await getBoats(page.current, BOATS_PER_PAGE);

      setBoats(prev => {
        const newBoats = [...prev, ...response.data].filter(
          (boat, index, self) => self.findIndex(b => b.id === boat.id) === index
        );

        if (newBoats.length >= response.total) hasMore.current = false;
        return newBoats;
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMoreBoats = useCallback(() => {
    if (loading || !hasMore.current) return;
    setLoading(true);
    page.current += 1;
    fetchBoats();
  }, [loading, fetchBoats]);

  useEffect(() => {
    setLoading(true);
    fetchBoats();
  }, [fetchBoats]);

  const bottomRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreBoats();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, fetchMoreBoats]);

  const filterdBoats = boats.filter(boat => (filter === 'Show Liked' ? boat.liked : true));

  const filterElements: ('Show All' | 'Show Liked')[] = ['Show All', 'Show Liked'];

  return (
    <main>
      <section className={styles.filters} aria-label="Filters">
        {filterElements.map(fEl => (
          <Button
            key={fEl}
            isSelected={filter === fEl}
            isDisabled={fEl === 'Show Liked' && !boats.some((boat) => boat.liked)}
            onClick={() => setFilter(fEl)}
          >
            {fEl}
          </Button>
        ))}
      </section>

      <div className={styles.container}>
        <ul className={styles.listings}>
          {filterdBoats.map(boat => (
            <li key={boat.id}>
              <BoatCardCompact boat={boat} handleLike={handleLike} />
            </li>
          ))}

          {hasMore.current && (
            <li ref={bottomRef} style={{ height: '1px' }}>
              {loading && 'Loading...'}
            </li>
          )}
        </ul>

        <aside aria-label="Map view">Map?</aside>
      </div>
    </main>
  );
}
