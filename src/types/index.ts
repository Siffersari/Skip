export interface Skip {
  id: number;
  size: number;
  hire_period_days: number;
  transport_cost: number | null;
  per_tonne_cost: number | null;
  price_before_vat: number;
  vat: number;
  postcode: string;
  area: string;
  forbidden: boolean;
  created_at: string;
  updated_at: string;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
  // Computed fields for display
  total_price?: number;
  display_name?: string;
  placeholder_image?: string;
}

export interface ApiResponse {
  skips: Skip[];
  postcode: string;
  area: string;
}

export interface StepProgress {
  current: number;
  steps: string[];
}

export interface SkipCardProps {
  skip: Skip;
  isSelected: boolean;
  onSelect: (skip: Skip) => void;
  isLoading?: boolean;
  showDetails?: boolean;
}

export interface FilterOptions {
  sortBy: 'price' | 'size';
  sortOrder: 'asc' | 'desc';
  showDetails: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
} 