export interface HealthStatus {
  status: string;
}

export interface TravelPackage {
  id: number;
  name: string;
  destination: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  duration: string;
  category: string;
  imageUrl?: string | null;
  includes: string[];
  featured: boolean;
  available: boolean;
  departureDate?: string | null;
  maxPeople?: number | null;
  createdAt: string;
}

export interface CreateTravelPackageBody {
  name: string;
  destination: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  duration: string;
  category: string;
  imageUrl?: string | null;
  includes: string[];
  featured: boolean;
  available: boolean;
  departureDate?: string | null;
  maxPeople?: number | null;
}

export type PackageSummaryCategoriesItem = {
  name: string;
  count: number;
};

export type PackageSummaryPriceRange = {
  min: number;
  max: number;
};

export interface PackageSummary {
  totalPackages: number;
  featuredPackages: number;
  availablePackages: number;
  categories: PackageSummaryCategoriesItem[];
  priceRange: PackageSummaryPriceRange;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export type ListPackagesParams = {
  category?: string;
  featured?: boolean;
};
