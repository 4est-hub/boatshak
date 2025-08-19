import { boats } from '@/data/boats';
import { Boat } from '@/types/boat';

interface Return {
  data: Boat[],
  total: number
}

export function getBoats(page: number = 1, limit: number = 50): Promise<Return>  {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedBoats = boats.slice(start, end);

  return new Promise((resolve) => {
    setTimeout(() => resolve({
      data: paginatedBoats,
      total: boats.length
    }), 1000);
  });
}