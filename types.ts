export type StockStatus = "inventory" | "upcoming";

export type ListingStatus = "available" | "pending" | "sold";

export interface InventoryCar {
  id: string;
  year: number;
  make: string;
  model: string;
  image: string;
  /** All listing photos (max 20). First entry matches `image` when present. */
  images?: string[];
  mileage: number;
  transmission: "Automatic" | "Manual";
  price: number;
  priceFeesIncluded: boolean;
  status: StockStatus;
  listingStatus: ListingStatus;
  featured?: boolean;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  complianceYear?: string;
  stockNumber?: string;
  advertisement?: string;
}
