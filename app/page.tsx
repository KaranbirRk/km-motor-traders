import { getFeaturedCars } from '../lib/inventoryService';
import HomePageClient from './HomePageClient';

export const revalidate = 60;

export default async function HomePage() {
  const featuredCars = await getFeaturedCars();
  return <HomePageClient featuredCars={featuredCars} />;
}
