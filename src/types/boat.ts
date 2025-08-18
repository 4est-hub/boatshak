export interface Boat {
  id: string;
  title: string;
  price: number;
  img: string;
  sellerType: 'OEM' | 'Dealer' | 'Private';
  liked: boolean;
}