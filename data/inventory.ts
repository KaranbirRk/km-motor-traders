import { InventoryCar } from '../types';

/**
 * Seed stock — every listing uses a unique local photo that matches make/model.
 * No image is reused. Swap for Friday live inventory when the API key is set.
 */
export const INVENTORY: InventoryCar[] = [
  {
    id: 'inv-1',
    year: 2022,
    make: 'Mercedes-Benz',
    model: 'S-Class',
    image: '/assets/MercedesBenz.png',
    mileage: 42800,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    price: 129900,
    priceFeesIncluded: true,
    status: 'inventory',
    listingStatus: 'available',
    featured: true,
    advertisement: `Looking for a dependable 2022 Mercedes-Benz S-Class? This example is now available at KM Motor Traders, 19 Hammond Road, Dandenong.

Presented in tidy order and ready for inspection. Showing approximately 42,800 km with an automatic transmission and petrol powertrain.

Key points
• Current kilometres: 42,800 km
• Transmission: Automatic
• Fuel type: Petrol
• Asking price: $129,900 (Inc. fees)

Call KM Motor Traders on 0410 052 424. LMCT 11727.`,
  },
  {
    id: 'inv-2',
    year: 2021,
    make: 'BMW',
    model: 'X5 M-Sport',
    image: '/assets/BMWX5.jpg',
    mileage: 61500,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    price: 94500,
    priceFeesIncluded: false,
    status: 'inventory',
    listingStatus: 'available',
    featured: true,
    advertisement: `Looking for a dependable 2021 BMW X5 M-Sport? This example is now available at KM Motor Traders, 19 Hammond Road, Dandenong.

Showing approximately 61,500 km with an automatic transmission and diesel powertrain.

Key points
• Current kilometres: 61,500 km
• Transmission: Automatic
• Fuel type: Diesel
• Asking price: $94,500 (Exc. fees)

Call 0410 052 424. LMCT 11727.`,
  },
  {
    id: 'inv-3',
    year: 2023,
    make: 'Porsche',
    model: 'Macan Turbo',
    image: '/assets/PorscheMacan.jpg',
    mileage: 35200,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    price: 118000,
    priceFeesIncluded: true,
    status: 'inventory',
    listingStatus: 'available',
    featured: true,
    advertisement: `Looking for a dependable 2023 Porsche Macan Turbo? This example is now available at KM Motor Traders, 19 Hammond Road, Dandenong.

Showing approximately 35,200 km with an automatic transmission and petrol powertrain.

Key points
• Current kilometres: 35,200 km
• Transmission: Automatic
• Fuel type: Petrol
• Asking price: $118,000 (Inc. fees)

Call 0410 052 424. LMCT 11727.`,
  },
  {
    id: 'inv-4',
    year: 2022,
    make: 'Range Rover',
    model: 'Sport',
    image: '/assets/RangeRoverSport.jpg',
    mileage: 78900,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    price: 105000,
    priceFeesIncluded: false,
    status: 'inventory',
    listingStatus: 'available',
    featured: true,
    advertisement: `Looking for a dependable 2022 Range Rover Sport? This example is now available at KM Motor Traders, 19 Hammond Road, Dandenong.

Showing approximately 78,900 km with an automatic transmission and diesel powertrain.

Key points
• Current kilometres: 78,900 km
• Transmission: Automatic
• Fuel type: Diesel
• Asking price: $105,000 (Exc. fees)

Call 0410 052 424. LMCT 11727.`,
  },
  {
    id: 'inv-5',
    year: 2021,
    make: 'Audi',
    model: 'A6 Prestige',
    image: '/assets/AudiA6.avif',
    mileage: 54100,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    price: 79900,
    priceFeesIncluded: true,
    status: 'inventory',
    listingStatus: 'available',
    featured: true,
    advertisement: `Looking for a dependable 2021 Audi A6 Prestige? This example is now available at KM Motor Traders, 19 Hammond Road, Dandenong.

Showing approximately 54,100 km with an automatic transmission and petrol powertrain.

Key points
• Current kilometres: 54,100 km
• Transmission: Automatic
• Fuel type: Petrol
• Asking price: $79,900 (Inc. fees)

Call 0410 052 424. LMCT 11727.`,
  },
  {
    id: 'inv-6',
    year: 2022,
    make: 'Lexus',
    model: 'RX 350',
    image: '/assets/LexusRX350.jpg',
    mileage: 47300,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    price: 72500,
    priceFeesIncluded: false,
    status: 'inventory',
    listingStatus: 'available',
    featured: true,
    advertisement: `Looking for a dependable 2022 Lexus RX 350? This example is now available at KM Motor Traders, 19 Hammond Road, Dandenong.

Showing approximately 47,300 km with an automatic transmission and petrol powertrain.

Key points
• Current kilometres: 47,300 km
• Transmission: Automatic
• Fuel type: Petrol
• Asking price: $72,500 (Exc. fees)

Call 0410 052 424. LMCT 11727.`,
  },

  // Upcoming — no stock photos reused (photos arriving with the vehicle)
  {
    id: 'up-1',
    year: 2024,
    make: 'Toyota',
    model: 'LandCruiser Prado',
    image: '/logo.png',
    mileage: 1200,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    price: 89900,
    priceFeesIncluded: true,
    status: 'upcoming',
    listingStatus: 'pending',
    featured: false,
    advertisement: `Arriving soon — 2024 Toyota LandCruiser Prado at KM Motor Traders, Dandenong.

Photos will be added when the vehicle lands. Call 0410 052 424 to register interest. LMCT 11727.`,
  },
  {
    id: 'up-2',
    year: 2024,
    make: 'Ford',
    model: 'Ranger Wildtrak',
    image: '/logo.png',
    mileage: 800,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    price: 78500,
    priceFeesIncluded: false,
    status: 'upcoming',
    listingStatus: 'pending',
    featured: false,
    advertisement: `Arriving soon — 2024 Ford Ranger Wildtrak at KM Motor Traders, Dandenong.

Photos will be added when the vehicle lands. Call 0410 052 424. LMCT 11727.`,
  },
  {
    id: 'up-3',
    year: 2023,
    make: 'Hyundai',
    model: 'Santa Fe Elite',
    image: '/logo.png',
    mileage: 4500,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    price: 52900,
    priceFeesIncluded: true,
    status: 'upcoming',
    listingStatus: 'pending',
    featured: false,
    advertisement: `Arriving soon — 2023 Hyundai Santa Fe Elite at KM Motor Traders, Dandenong.

Photos will be added when the vehicle lands. Call 0410 052 424. LMCT 11727.`,
  },
];
