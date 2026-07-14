import { InventoryCar } from '../types';
import { INVENTORY } from '../data/inventory';
import { fetchFridayInventory } from './saasInventoryClient';
import { mapSaasVehicle } from './mapSaasVehicle';

const API_CONFIGURED = Boolean(process.env.FRIDAY_API_KEY);

type InventorySource = 'api' | 'fallback';

async function fetchAllCarsWithSource(): Promise<{ cars: InventoryCar[]; source: InventorySource }> {
  if (!API_CONFIGURED) return { cars: INVENTORY, source: 'fallback' };

  try {
    const raw = await fetchFridayInventory();
    if (raw.length === 0) return { cars: INVENTORY, source: 'fallback' };
    return { cars: raw.map(mapSaasVehicle), source: 'api' };
  } catch (err) {
    console.error('[inventoryService] Friday API fetch failed, using seed fallback:', err);
    return { cars: INVENTORY, source: 'fallback' };
  }
}

async function fetchAllCars(): Promise<InventoryCar[]> {
  const { cars } = await fetchAllCarsWithSource();
  return cars;
}

export async function getInventoryWithSource(): Promise<{
  inventoryCars: InventoryCar[];
  upcomingCars: InventoryCar[];
  source: InventorySource;
}> {
  const { cars, source } = await fetchAllCarsWithSource();
  return {
    inventoryCars: cars.filter((car) => car.status === 'inventory'),
    upcomingCars: cars.filter((car) => car.status === 'upcoming'),
    source,
  };
}

export async function getInventoryCars(): Promise<InventoryCar[]> {
  const all = await fetchAllCars();
  return all.filter((car) => car.status === 'inventory');
}

export async function getUpcomingCars(): Promise<InventoryCar[]> {
  const all = await fetchAllCars();
  return all.filter((car) => car.status === 'upcoming');
}

export async function getFeaturedCars(): Promise<InventoryCar[]> {
  const inventory = await getInventoryCars();
  const flagged = inventory.filter((car) => car.featured);
  return flagged.length > 0 ? flagged : inventory.slice(0, 9);
}

export async function getCarById(id: string): Promise<InventoryCar | null> {
  const all = await fetchAllCars();
  return all.find((car) => car.id === id) ?? null;
}
