import { getInventoryWithSource } from '../../lib/inventoryService';
import InventoryPageClient from './InventoryPageClient';

export const revalidate = 60;

export default async function InventoryPage() {
  const { inventoryCars, upcomingCars, source } = await getInventoryWithSource();

  return (
    <InventoryPageClient
      inventoryCars={inventoryCars}
      upcomingCars={upcomingCars}
      source={source}
    />
  );
}
