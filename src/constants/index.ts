export const API_BASE_URL = 'https://app.wewantwaste.co.uk/api';
export const ENDPOINTS = {
  SKIPS_BY_LOCATION: '/skips/by-location'
};

export const LOCATION_CONFIG = {
  POSTCODE: 'NR32',
  AREA: 'Lowestoft',
} as const;

export const PROGRESS_STEPS: string[] = [
  'Postcode',
  'Waste Type', 
  'Select Skip',
  'Permit Check',
  'Choose Date',
  'Payment'
];

export const CURRENT_STEP = 3; 