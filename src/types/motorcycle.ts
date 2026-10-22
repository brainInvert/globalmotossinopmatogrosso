export type VehicleType = 'moto' | 'carro';

export type MotorcycleCategory =
  | 'street'
  | 'trail'
  | 'custom'
  | 'scooter'
  | 'sport'
  | 'touring'
  | 'picape'
  | 'suv'
  | 'sedan'
  | 'hatchback';

export interface TechnicalSpecs {
  powerHp: number;
  torqueNm: number;
  weightKg: number;
  tankCapacityL: number;
  consumptionKmPerL: number;
  cylinderCount?: number;
  cooling?: string;
  frontBrake?: string;
  rearBrake?: string;
}

export interface Motorcycle {
  id: string;
  vehicleType?: VehicleType;
  title: string;
  brand: string;
  model: string;
  version?: string;
  yearManufacture: number;
  yearModel: number;
  price: number;
  fipePrice: number;
  mileage: number;
  engineCapacity: number; // cc para motos ou cilindrada/potência
  fuelType: 'Gasolina' | 'Flex' | 'Elétrica' | 'Diesel' | 'Híbrido';
  color: string;
  category: MotorcycleCategory;
  transmission: 'Manual' | 'Automático' | 'CVT' | 'Quickshifter' | 'Semi-Automático';
  state: string;
  city: string;
  images: string[];
  description: string;
  features: string[];
  sellerId: string;
  sellerName: string;
  sellerPhone: string; // WhatsApp
  sellerType: 'particular' | 'concessionaria';
  featured?: boolean;
  status: 'active' | 'pending' | 'sold';
  createdAt: string;
  technicalSpecs: TechnicalSpecs;
}

export interface MotorcycleFilterParams {
  query?: string;
  vehicleType?: VehicleType | '';
  brand?: string;
  model?: string;
  category?: MotorcycleCategory | '';
  minYear?: number;
  maxYear?: number;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  minEngineCapacity?: number;
  maxEngineCapacity?: number;
  state?: string;
  city?: string;
  sellerType?: 'particular' | 'concessionaria' | '';
  sortBy?: 'price_asc' | 'price_desc' | 'year_desc' | 'mileage_asc' | 'recent';
}
