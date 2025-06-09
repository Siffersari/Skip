import axios, { AxiosInstance, AxiosError } from 'axios';
import { Skip } from '../types';

export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://app.wewantwaste.co.uk/api',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY: 1000,
} as const;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 429 && originalRequest) {
      const retryAfter = parseInt(error.response.headers['retry-after'] || '1', 10);
      await sleep(retryAfter * 1000);
      return apiClient(originalRequest);
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new ApiError('Request timeout. Please check your connection.', 408, 'TIMEOUT');
    }
    
    if (!error.response) {
      throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
    }
    
    const status = error.response.status;
    const message = (error.response.data as any)?.message || error.message;
    
    switch (status) {
      case 400:
        throw new ApiError(`Bad request: ${message}`, 400, 'BAD_REQUEST');
      case 401:
        throw new ApiError('Unauthorized access.', 401, 'UNAUTHORIZED');
      case 403:
        throw new ApiError('Access forbidden.', 403, 'FORBIDDEN');
      case 404:
        throw new ApiError('Resource not found.', 404, 'NOT_FOUND');
      case 500:
        throw new ApiError('Server error. Please try again later.', 500, 'SERVER_ERROR');
      case 502:
        throw new ApiError('Service temporarily unavailable.', 502, 'BAD_GATEWAY');
      case 503:
        throw new ApiError('Service temporarily unavailable.', 503, 'SERVICE_UNAVAILABLE');
      default:
        throw new ApiError(`Request failed: ${message}`, status, 'API_ERROR');
    }
  }
);

const exponentialBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = API_CONFIG.MAX_RETRIES,
  baseDelay: number = API_CONFIG.INITIAL_RETRY_DELAY
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      if (error instanceof ApiError && [400, 401, 403, 404].includes(error.statusCode)) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await sleep(delay);
    }
  }
  
  throw lastError!;
};

export const fetchSkipsByLocation = async (postcode: string, area: string): Promise<Skip[]> => {
  if (!postcode?.trim() || !area?.trim()) {
    throw new ApiError('Postcode and area are required.', 400, 'VALIDATION_ERROR');
  }

  const isDevelopment = process.env.NODE_ENV === 'development';
  const useMockData = isDevelopment && process.env.REACT_APP_USE_MOCK_DATA === 'true';

  if (useMockData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return getMockSkips();
  }

  return exponentialBackoff(async () => {
    const response = await apiClient.get(`/skips/by-location`, {
      params: { postcode: postcode.trim(), area: area.trim() }
    });
    
    const data = response.data;
    
    if (Array.isArray(data)) {
      return transformSkipsData(data);
    }
    
    if (data?.skips && Array.isArray(data.skips)) {
      return transformSkipsData(data.skips);
    }
    
    if (data?.data && Array.isArray(data.data)) {
      return transformSkipsData(data.data);
    }
    
    throw new ApiError('Invalid data format received from server', 502, 'INVALID_RESPONSE');
  });
};

const transformSkipsData = (rawSkips: unknown[]): Skip[] => {
  if (!Array.isArray(rawSkips)) {
    throw new ApiError('Invalid skip data format received', 502, 'INVALID_DATA_FORMAT');
  }

  const transformedSkips = rawSkips
    .map((skip) => {
      try {
        const skipData = skip as any;
        
        const priceBeforeVat = Number(skipData.price_before_vat) || 0;
        const vatRate = Number(skipData.vat) || 20;
        const totalPrice = Math.round(priceBeforeVat * (1 + vatRate / 100));
        
        const transformedSkip: Skip = {
          id: Number(skipData.id),
          size: Number(skipData.size),
          hire_period_days: Number(skipData.hire_period_days) || 14,
          transport_cost: skipData.transport_cost ? Number(skipData.transport_cost) : null,
          per_tonne_cost: skipData.per_tonne_cost ? Number(skipData.per_tonne_cost) : null,
          price_before_vat: priceBeforeVat,
          vat: vatRate,
          postcode: String(skipData.postcode || ''),
          area: String(skipData.area || ''),
          forbidden: Boolean(skipData.forbidden),
          created_at: String(skipData.created_at || ''),
          updated_at: String(skipData.updated_at || ''),
          allowed_on_road: Boolean(skipData.allowed_on_road),
          allows_heavy_waste: Boolean(skipData.allows_heavy_waste),
          total_price: totalPrice,
          display_name: `${skipData.size} Yard Skip`,
          placeholder_image: ``
        };
        
        return transformedSkip;
      } catch (error) {
        console.error('Error transforming skip data:', error, skip);
        return null;
      }
    })
    .filter((skip): skip is Skip => skip !== null);

  if (transformedSkips.length === 0) {
    throw new ApiError('No valid skip data found for this location', 404, 'NO_VALID_DATA');
  }

  return transformedSkips;
};

const getMockSkips = (): Skip[] => [
  {
    id: 17933,
    size: 4,
    hire_period_days: 14,
    transport_cost: null,
    per_tonne_cost: null,
    price_before_vat: 278,
    vat: 20,
    postcode: "NR32",
    area: "",
    forbidden: false,
    created_at: "2025-04-03T13:51:46.897146",
    updated_at: "2025-04-07T13:16:52.813",
    allowed_on_road: true,
    allows_heavy_waste: false,
    total_price: 334,
    display_name: "4 Yard Skip",
    placeholder_image: ""
  },
  {
    id: 17934,
    size: 6,
    hire_period_days: 14,
    transport_cost: null,
    per_tonne_cost: null,
    price_before_vat: 305,
    vat: 20,
    postcode: "NR32",
    area: "",
    forbidden: false,
    created_at: "2025-04-03T13:51:46.897146",
    updated_at: "2025-04-07T13:16:52.992",
    allowed_on_road: true,
    allows_heavy_waste: true,
    total_price: 366,
    display_name: "6 Yard Skip",
    placeholder_image: ""
  },
  {
    id: 17935,
    size: 8,
    hire_period_days: 14,
    transport_cost: null,
    per_tonne_cost: null,
    price_before_vat: 375,
    vat: 20,
    postcode: "NR32",
    area: "",
    forbidden: false,
    created_at: "2025-04-03T13:51:46.897146",
    updated_at: "2025-04-07T13:16:53.171",
    allowed_on_road: true,
    allows_heavy_waste: true,
    total_price: 450,
    display_name: "8 Yard Skip",
    placeholder_image: ""
  },
  {
    id: 17936,
    size: 16,
    hire_period_days: 14,
    transport_cost: null,
    per_tonne_cost: null,
    price_before_vat: 496,
    vat: 20,
    postcode: "NR32",
    area: "",
    forbidden: false,
    created_at: "2025-04-03T13:51:46.897146",
    updated_at: "2025-04-07T13:16:53.339",
    allowed_on_road: false,
    allows_heavy_waste: false,
    total_price: 595,
    display_name: "16 Yard Skip",
    placeholder_image: ""
  },
  {
    id: 17937,
    size: 20,
    hire_period_days: 14,
    transport_cost: null,
    per_tonne_cost: null,
    price_before_vat: 992,
    vat: 20,
    postcode: "NR32",
    area: "",
    forbidden: false,
    created_at: "2025-04-03T13:51:46.897146",
    updated_at: "2025-04-07T13:16:53.516",
    allowed_on_road: false,
    allows_heavy_waste: true,
    total_price: 1190,
    display_name: "20 Yard Skip",
    placeholder_image: ""
  },
  {
    id: 17938,
    size: 40,
    hire_period_days: 14,
    transport_cost: null,
    per_tonne_cost: null,
    price_before_vat: 992,
    vat: 20,
    postcode: "NR32",
    area: "",
    forbidden: false,
    created_at: "2025-04-03T13:51:46.897146",
    updated_at: "2025-04-07T13:16:53.69",
    allowed_on_road: false,
    allows_heavy_waste: false,
    total_price: 1190,
    display_name: "40 Yard Skip",
    placeholder_image: ""
  }
];

export default apiClient; 