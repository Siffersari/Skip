import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  Truck, 
  Calendar,
  CheckCircle2,
  Info,
  AlertTriangle,
  Navigation,
  Package
} from 'lucide-react';
import { SkipCardProps } from '../types';
import { formatCurrency } from '../utils';

const SkipCard: React.FC<SkipCardProps> = ({
  skip,
  isSelected,
  onSelect,
  isLoading = false,
  showDetails: externalShowDetails
}) => {
  const [internalShowDetails, setInternalShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);

  const showDetails = externalShowDetails !== undefined ? externalShowDetails : internalShowDetails;

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if (!isLoading) {
      onSelect(skip);
    }
  }, [isLoading, onSelect, skip]);

  const handleDetailsToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalShowDetails === undefined) {
      setInternalShowDetails(prev => !prev);
    }
  }, [externalShowDetails]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const suitabilityInfo = useMemo(() => {
    if (skip.size <= 2) {
      return {
        quick: 'Small domestic clearouts and garden waste',
        equivalent: '20-30 bin bags',
        detailed: [
          'Small household clearouts',
          'Garden waste and prunings', 
          'Small DIY projects',
          'Bathroom tidy-ups',
          'Decluttering single rooms'
        ]
      };
    } else if (skip.size <= 4) {
      return {
        quick: 'Small domestic projects, garden clearouts, DIY work',
        equivalent: '30-40 bin bags',
        detailed: [
          'Small household clearouts (1-2 rooms)',
          'Garden waste and prunings',
          'Bathroom renovations',
          'Small kitchen refits',
          'DIY projects and repairs'
        ]
      };
    } else if (skip.size <= 6) {
      return {
        quick: 'Medium domestic projects, home renovations',
        equivalent: '50-60 bin bags',
        detailed: [
          'Kitchen and bathroom renovations',
          'Home extension work', 
          'Large garden clearouts',
          'Flooring and tiling projects',
          'General construction waste'
        ]
      };
    } else if (skip.size <= 8) {
      return {
        quick: 'Popular choice for medium-large projects',
        equivalent: '60-80 bin bags',
        detailed: [
          'Home renovations and extensions',
          'Construction waste disposal',
          'Large household clearouts',
          'Commercial small projects',
          'Mixed waste disposal'
        ]
      };
    } else if (skip.size <= 10) {
      return {
        quick: 'Large residential and commercial projects',
        equivalent: '80-100 bin bags',
        detailed: [
          'Large construction projects',
          'Commercial property clearouts',
          'Major home renovations',
          'Office refurbishments',
          'Industrial light waste'
        ]
      };
    } else if (skip.size <= 12) {
      return {
        quick: 'Large projects, commercial work, major construction',
        equivalent: '100-120 bin bags',
        detailed: [
          'Major construction projects',
          'Commercial property clearouts',
          'Large home renovations',
          'Industrial waste disposal',
          'Office fit-out waste'
        ]
      };
    } else if (skip.size <= 14) {
      return {
        quick: 'Major commercial and industrial projects',
        equivalent: '120-140 bin bags',
        detailed: [
          'Large construction sites',
          'Commercial demolition projects',
          'Industrial waste disposal',
          'Major renovation projects',
          'Large-scale clearouts'
        ]
      };
    } else if (skip.size <= 16) {
      return {
        quick: 'Large commercial and industrial projects',
        equivalent: '140-160 bin bags',
        detailed: [
          'Major construction sites',
          'Commercial demolition projects',
          'Industrial waste disposal',
          'Major renovation projects',
          'Large office clearouts'
        ]
      };
    } else if (skip.size <= 20) {
      return {
        quick: 'Light construction and demolition waste solutions',
        equivalent: '160-200 bin bags',
        detailed: [
          'Light construction and demolition',
          'Commercial property clearouts',
          'Large renovation projects',
          'Industrial light waste',
          'Major office refurbishments'
        ]
      };
    } else {
      return {
        quick: 'Largest skip for major commercial light waste projects',
        equivalent: '350-400 bin bags',
        detailed: [
          'Large commercial light waste projects',
          'Major property clearouts',
          'Industrial light waste disposal',
          'Large-scale renovation projects',
          'Commercial demolition (light materials only)'
        ]
      };
    }
  }, [skip.size]);

  const imageUrl = useMemo(() => {
    if (imageError) {
      return `/assets/images/${skip.size}-yarder-skip.jpg`;
    }
    return skip.placeholder_image || `/assets/images/${skip.size}-yarder-skip.jpg`;
  }, [imageError, skip.placeholder_image, skip.size]);

  return (
    <motion.div
      className={`
        relative bg-white rounded-xl border-2 transition-all duration-300 cursor-pointer overflow-hidden
        h-full flex flex-col
        ${isSelected 
          ? 'border-accent-500 shadow-lg ring-2 ring-accent-200 bg-blue-50' 
          : 'border-neutral-200 hover:border-accent-300 hover:shadow-lg'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={handleCardClick}
      whileHover={!isLoading ? { y: -2, scale: 1.01 } : {}}
      whileTap={!isLoading ? { scale: 0.99 } : {}}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {isSelected && (
        <motion.div
          className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-accent-600 to-accent-700 text-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 shadow-sm z-30"
          initial={{ scale: 0, x: -20, y: -20 }}
          animate={{ scale: 1, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <CheckCircle2 className="w-3 h-3" />
          <span>Selected</span>
        </motion.div>
      )}

      <div className="relative h-40 sm:h-48 overflow-hidden bg-neutral-200 flex-shrink-0">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={imageUrl}
            alt={`${skip.size} yard skip`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="absolute bottom-2 right-2 sm:hidden">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
            <CheckCircle2 className={`w-4 h-4 ${isSelected ? 'text-accent-600' : 'text-neutral-400'}`} />
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col min-h-0">
        <div className="flex items-start justify-between mb-3 flex-shrink-0">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <motion.div 
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0
                ${isSelected ? 'bg-accent-100' : 'bg-neutral-200'}
              `}
              animate={{ 
                backgroundColor: isSelected ? '#DBEAFE' : '#EAEAEA',
                scale: isSelected ? 1.05 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Truck className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-accent-600' : 'text-neutral-600'}`} />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm sm:text-base font-bold text-secondary-800 truncate">
                {skip.display_name || `${skip.size} Yard Skip`}
              </h3>
              <p className="text-xs text-neutral-500">{skip.size} cubic yards</p>
              <p className="text-xs text-primary-600 font-medium">≈ {suitabilityInfo.equivalent}</p>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0 ml-2">
            <motion.div 
              className={`text-lg sm:text-xl font-bold ${isSelected ? 'text-secondary-800' : 'text-secondary-800'}`}
              animate={{ scale: isSelected ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {formatCurrency(skip.total_price)}
            </motion.div>
            <div className="text-xs text-neutral-500">Inc. VAT</div>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2 mb-3 flex-shrink-0">
          <div className="flex items-center space-x-2 text-xs text-neutral-500">
            <Calendar className="w-3 h-3 text-primary-600 flex-shrink-0" />
            <span>{skip.hire_period_days} day hire period</span>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-neutral-500">
            <Navigation className="w-3 h-3 text-primary-600 flex-shrink-0" />
            <span className={skip.allowed_on_road ? 'text-success-600' : 'text-warning-600'}>
              {skip.allowed_on_road ? 'Can be placed on road' : 'Private property only'}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-neutral-500">
            <Package className="w-3 h-3 text-primary-600 flex-shrink-0" />
            <span className={skip.allows_heavy_waste ? 'text-success-600' : 'text-warning-600'}>
              {skip.allows_heavy_waste ? 'Heavy waste allowed' : 'Light waste only'}
            </span>
          </div>
        </div>

        <div className="mb-3 flex-1 min-h-0">
          <div className="flex items-center space-x-2 mb-1.5">
            <Info className="w-3 h-3 text-primary-500 flex-shrink-0" />
            <span className="text-xs font-medium text-secondary-700">Suitable for:</span>
          </div>
          <div className="text-xs text-neutral-500 line-clamp-2">
            {suitabilityInfo.quick}
          </div>
        </div>

        <div className="mt-auto flex-shrink-0">
          {externalShowDetails === undefined && (
            <motion.button
              onClick={handleDetailsToggle}
              className="flex items-center justify-between w-full p-2 text-xs text-neutral-500 bg-neutral-200 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span>View Details</span>
              <motion.div
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-3 h-3" />
              </motion.div>
            </motion.button>
          )}

          <motion.div
            initial={false}
            animate={{ 
              height: showDetails ? 'auto' : 0,
              opacity: showDetails ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {showDetails && (
              <div className="pt-3 space-y-3">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-3 h-3 text-primary-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-secondary-700">Specific uses:</span>
                  </div>
                  <ul className="text-xs text-neutral-500 space-y-1">
                    {suitabilityInfo.detailed.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3 h-3 text-success-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {(skip.transport_cost !== null || skip.per_tonne_cost !== null) && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-3 h-3 text-accent-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-secondary-700">Pricing details:</span>
                    </div>
                    <div className="text-xs text-neutral-500 space-y-1">
                      {skip.transport_cost !== null && (
                        <div className="flex items-center justify-between">
                          <span>Transport cost:</span>
                          <span className="font-medium">
                            {skip.transport_cost === 0 ? 'Included' : formatCurrency(skip.transport_cost)}
                          </span>
                        </div>
                      )}
                      {skip.per_tonne_cost !== null && (
                        <div className="flex items-center justify-between">
                          <span>Per tonne cost:</span>
                          <span className="font-medium">
                            {skip.per_tonne_cost === 0 ? 'Included' : `${formatCurrency(skip.per_tonne_cost)}/tonne`}
                          </span>
                        </div>
                      )}
                      {(skip.transport_cost === 0 || skip.per_tonne_cost === 0) && (
                        <div className="text-xs text-success-600 mt-1">
                          Base price includes all costs shown above
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-3 h-3 text-warning-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-secondary-700">Restrictions:</span>
                  </div>
                  <ul className="text-xs text-neutral-500 space-y-1">
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-3 h-3 text-warning-500 flex-shrink-0 mt-0.5" />
                      <span>No hazardous materials</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <AlertTriangle className="w-3 h-3 text-warning-500 flex-shrink-0 mt-0.5" />
                      <span>No electrical appliances</span>
                    </li>
                    {!skip.allows_heavy_waste && (
                      <li className="flex items-start space-x-2">
                        <AlertTriangle className="w-3 h-3 text-warning-500 flex-shrink-0 mt-0.5" />
                        <span>No concrete, soil, or rubble</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                  <div className="text-xs text-neutral-500 space-y-1">
                    <p><strong>Delivery:</strong> Same-day or next-day available</p>
                    <p><strong>Collection:</strong> Automatic after {skip.hire_period_days} days</p>
                    <p><strong>Payment:</strong> Pay on delivery or online</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

SkipCard.displayName = 'SkipCard';

export default SkipCard;