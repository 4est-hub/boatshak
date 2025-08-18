import { Boat } from '@/types/boat';

export const boats: Boat[] = Array.from({ length: 20 }, (_, i) => {
  const boatTypes = ['Speedster', 'Sailor', 'Fisher', 'Explorer', 'WaveRider'];
  const sellerTypes: Boat['sellerType'][] = ['OEM', 'Dealer', 'Private'];
  const randomBoat = boatTypes[Math.floor(Math.random() * boatTypes.length)];
  const randomSeller = sellerTypes[Math.floor(Math.random() * sellerTypes.length)];
  const randomPrice = Math.floor(Math.random() * 90000) + 10000; // $10k-$100k
  const randomImg = `https://picsum.photos/seed/boat${i}/400/200`;

  return {
    id: `boat-${i + 1}`,
    title: `${randomBoat} Model ${Math.floor(Math.random() * 1000)}`,
    img: randomImg,
    price: randomPrice,
    sellerType: randomSeller,
    liked: false,
  };
});