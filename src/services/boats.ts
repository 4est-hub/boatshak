import { boats } from '@/data/boats';
import { Boat } from '@/types/boat';

interface Return {
  data: Boat[],
  total: number
}

export async function toggleBoatLike(id: string, liked: boolean): Promise<{ id: string; liked: boolean }> {
  const likedBoats: Record<string, boolean> = JSON.parse(localStorage.getItem('likedBoats') || '{}')
  likedBoats[id] = liked
  localStorage.setItem('likedBoats', JSON.stringify(likedBoats))

  const boat = boats.find(b => b.id === id)
  if (boat) boat.liked = liked

  return { id, liked }
}


export function getBoats(page: number = 1, limit: number = 50): Promise<Return> {
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedBoats = boats.slice(start, end)

  const likedBoats = JSON.parse(localStorage.getItem('likedBoats') || '{}')
  const mergedBoats = paginatedBoats.map(b => ({ ...b, liked: likedBoats[b.id] ?? b.liked }))

  return new Promise(resolve => {
    setTimeout(() => resolve({
      data: mergedBoats,
      total: boats.length
    }), 500)
  })
}
