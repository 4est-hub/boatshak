import { boats } from '@/data/boats';
import { Boat } from '@/types/boat'

export function getBoats(): Promise<Boat[]>  {
  return new Promise((resolve) => {
    setTimeout(() => resolve(boats), 1000);
  });
}