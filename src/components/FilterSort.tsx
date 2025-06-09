import React from 'react';
import { AdjustmentsHorizontalIcon, ArrowsUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { FilterOptions } from '../types';

interface FilterSortProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  skipCount: number;
}

const FilterSort: React.FC<FilterSortProps> = ({ filters, onFiltersChange, skipCount }) => {
  const handleSortChange = (sortBy: 'price' | 'size') => {
    if (filters.sortBy === sortBy) {
      onFiltersChange({ 
        ...filters, 
        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
      });
    } else {
      onFiltersChange({ 
        ...filters, 
        sortBy, 
        sortOrder: 'asc' 
      });
    }
  };

  const handleDetailsToggle = () => {
    onFiltersChange({ ...filters, showDetails: !filters.showDetails });
  };

  const getSortIcon = (sortType: 'price' | 'size') => {
    if (filters.sortBy !== sortType) return null;
    
    return filters.sortOrder === 'asc' ? (
      <ChevronUpIcon className="w-3 h-3 ml-1" />
    ) : (
      <ChevronDownIcon className="w-3 h-3 ml-1" />
    );
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Mobile Layout */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-700 font-medium">
            {skipCount} skip{skipCount !== 1 ? 's' : ''}
          </span>
          {/* Mobile Details Toggle */}
          <label className="flex items-center cursor-pointer">
            <span className="text-xs text-gray-600 mr-2">Details</span>
            <input
              type="checkbox"
              checked={filters.showDetails}
              onChange={handleDetailsToggle}
              className="sr-only"
            />
            <div
              className={`
                relative inline-flex h-4 w-7 items-center rounded-full transition-colors
                ${filters.showDetails ? 'bg-primary-500' : 'bg-gray-300'}
              `}
            >
              <span
                className={`
                  inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform
                  ${filters.showDetails ? 'translate-x-3.5' : 'translate-x-0.5'}
                `}
              />
            </div>
          </label>
        </div>
        
        {/* Mobile Sort */}
        <div className="flex items-center justify-center">
          <div className="flex rounded-md border border-gray-300 overflow-hidden w-full max-w-xs">
            <button
              onClick={() => handleSortChange('price')}
              className={`
                flex-1 px-4 py-2 text-sm font-medium transition-colors cursor-pointer
                flex items-center justify-center
                ${filters.sortBy === 'price'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              Price
              {getSortIcon('price')}
            </button>
            <button
              onClick={() => handleSortChange('size')}
              className={`
                flex-1 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 cursor-pointer
                flex items-center justify-center
                ${filters.sortBy === 'size'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              Size
              {getSortIcon('size')}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex sm:items-center sm:justify-between">
        {/* Results Count */}
        <div className="flex items-center">
          <span className="text-sm text-gray-700 font-medium">
            {skipCount} skip{skipCount !== 1 ? 's' : ''} available
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <ArrowsUpDownIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="flex rounded-md border border-gray-300 overflow-hidden">
              <button
                onClick={() => handleSortChange('price')}
                className={`
                  px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer
                  flex items-center
                  ${filters.sortBy === 'price'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                Price
                {getSortIcon('price')}
              </button>
              <button
                onClick={() => handleSortChange('size')}
                className={`
                  px-3 py-1.5 text-sm font-medium transition-colors border-l border-gray-300 cursor-pointer
                  flex items-center
                  ${filters.sortBy === 'size'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                Size
                {getSortIcon('size')}
              </button>
            </div>
          </div>

          {/* Details Toggle */}
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Details:</span>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showDetails}
                onChange={handleDetailsToggle}
                className="sr-only"
              />
              <div
                className={`
                  relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                  ${filters.showDetails ? 'bg-primary-500' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    inline-block h-3 w-3 transform rounded-full bg-white transition-transform
                    ${filters.showDetails ? 'translate-x-5' : 'translate-x-1'}
                  `}
                />
              </div>
              <span className="ml-2 text-sm text-gray-700">All</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSort; 