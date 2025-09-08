'use client'

import { useCallback, useRef, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

import styles from './BoatsPage.module.scss'

import { getBoats } from '@/services/boats'
import type { Boat } from '@/types/boat'
import { useToggleBoatLike } from '@/hooks/useToggleBoatLike'
import BoatCardCompact from '@/app/components/BoatCardCompact/BoatCardCompact'
import Button from '@/app/components/ui/Button/Button'

const BOATS_PER_PAGE = 10

export default function Boats() {
  const likeMutation = useToggleBoatLike()
  const observer = useRef<IntersectionObserver | null>(null)
  const [filter, setFilter] = useState<'Show All' | 'Show Liked'>('Show All')

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['boats'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getBoats(pageParam, BOATS_PER_PAGE)
      return { 
        boats: response.data, 
        total: response.total, 
        page: pageParam 
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.flatMap(p => p.boats).length
      if (loaded >= lastPage.total) return undefined
      return lastPage.page + 1
    },
    initialPageParam: 1,
  })

  const allBoats: Boat[] = data?.pages.flatMap(p => p.boats) ?? []

  const handleLike = (id: string, currentLiked: boolean) => {
    likeMutation.mutate({ id, liked: !currentLiked })
  }

  const bottomRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetchingNextPage) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  const filteredBoats = allBoats.filter(boat =>
    filter === 'Show Liked' ? boat.liked : true
  )

  const filterElements: ('Show All' | 'Show Liked')[] = ['Show All', 'Show Liked']

  return (
    <main>
      <section className={styles.filters} aria-label="Filters">
        {filterElements.map(fEl => (
          <Button
            key={fEl}
            isSelected={filter === fEl}
            isDisabled={fEl === 'Show Liked' && !allBoats.some(b => b.liked)}
            onClick={() => setFilter(fEl)}
          >
            {fEl}
          </Button>
        ))}
      </section>

      <div className={styles.container}>
        <ul className={styles.listings}>
          {filteredBoats.map(boat => (
            <li key={boat.id}>
              <BoatCardCompact
                boat={boat}
                handleLike={() => handleLike(boat.id, boat.liked)}
              />
            </li>
          ))}

          {hasNextPage && (
            <li ref={bottomRef} style={{ height: '1px' }}>
              {isFetchingNextPage && 'Loading...'}
            </li>
          )}
        </ul>

        <aside aria-label="Map view">Map?</aside>
      </div>
    </main>
  )
}
