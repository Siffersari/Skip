import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TruckIcon } from 'lucide-react';
import SkipCard from '../components/SkipCard';
import FilterSort from '../components/FilterSort';
import FloatingFooter from '../components/common/FloatingFooter';
import { LoadingSpinner } from '../components/ui';
import { useSkips } from '../hooks';
import { LOCATION_CONFIG } from '../constants';
import { Skip, FilterOptions } from '../types';

interface SkipSelectionPageProps {
  onBack: () => void;
  onContinue: (selectedSkip: Skip) => void;
}

const SkipSelectionPage: React.FC<SkipSelectionPageProps> = ({
  onBack,
  onContinue
}) => {
  const { skips, loading, error, refetch } = useSkips(
    LOCATION_CONFIG.POSTCODE, 
    LOCATION_CONFIG.AREA
  );
  
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'price',
    showDetails: false
  });

  const sortedSkips = useMemo(() => {
    if (!skips.length) return [];

    return [...skips].sort((a, b) => {
      if (filters.sortBy === 'price') {
        return (a.total_price || 0) - (b.total_price || 0);
      } else {
        return a.size - b.size;
      }
    });
  }, [skips, filters.sortBy]);

  // Auto-select 6-yard skip as default
  useEffect(() => {
    if (sortedSkips.length > 0 && !selectedSkip) {
      const sixYardSkip = sortedSkips.find(skip => skip.size === 6);
      const defaultSkip = sixYardSkip || sortedSkips[0];
      
      if (defaultSkip) {
        setSelectedSkip(defaultSkip);
      }
    }
  }, [sortedSkips, selectedSkip]);

  const handleSkipSelect = useCallback((skip: Skip) => {
    setSelectedSkip(skip);
  }, []);

  const handleContinue = useCallback(() => {
    if (selectedSkip) {
      onContinue(selectedSkip);
    }
  }, [selectedSkip, onContinue]);

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const handleRetry = useCallback(() => {
    toast.promise(
      refetch(),
      {
        loading: 'Refreshing skip options...',
        success: 'Skip options updated!',
        error: 'Failed to refresh. Please try again.',
      }
    );
  }, [refetch]);

  const handleGoHome = useCallback(() => {
    toast.loading('Returning to homepage...', { duration: 1000 });
    setTimeout(() => {
      window.location.href = '/'; 
    }, 1000);
  }, []);

  const handleContactSupport = useCallback(() => {
    window.location.href = 'tel:01502123456';
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading available skips...</p>
          <p className="text-sm text-gray-500 mt-2">
            Fetching real-time pricing for {LOCATION_CONFIG.AREA}, {LOCATION_CONFIG.POSTCODE}
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Unable to Load Skip Options
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <p className="text-sm text-gray-500 mb-8">
            We're having trouble connecting to our skip pricing system. This ensures you get the most accurate, up-to-date pricing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleRetry}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Try Again
            </motion.button>
            
            <motion.button
              onClick={handleContactSupport}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Call Us: 01502 123 456
            </motion.button>
            
            <motion.button
              onClick={handleGoHome}
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go Home
            </motion.button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Need immediate help?</strong> Call us at{' '}
              <a href="tel:01502123456" className="font-semibold underline">
                01502 123 456
              </a>{' '}
              and we'll provide pricing over the phone.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!loading && sortedSkips.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Skips Available
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any skip options for {LOCATION_CONFIG.AREA}, {LOCATION_CONFIG.POSTCODE}.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            This could be a temporary issue with our system or this location may not be in our current service area.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleRetry}
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Check Again
            </motion.button>
            
            <motion.button
              onClick={handleContactSupport}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-4 lg:py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            Choose Your Skip Size
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            Select the skip size that best suits your needs. All prices include {sortedSkips[0]?.vat || 20}% VAT and delivery to {LOCATION_CONFIG.AREA}, {LOCATION_CONFIG.POSTCODE}.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <motion.div 
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FilterSort
            filters={filters}
            onFiltersChange={setFilters}
            skipCount={sortedSkips.length}
          />
        </motion.div>

        {/* Skip Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {sortedSkips.map((skip, index) => (
            <motion.div
              key={skip.id}
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.1 * Math.min(index, 8),
                ease: "easeOut"
              }}
            >
              <SkipCard
                skip={skip}
                isSelected={selectedSkip?.id === skip.id}
                onSelect={handleSkipSelect}
                isLoading={false}
                showDetails={filters.showDetails}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile spacing for floating footer */}
        <div className="h-20 sm:h-32" />
      </motion.div>

      {/* Floating Footer */}
      <FloatingFooter
        selectedSkip={selectedSkip}
        currentStep={3}
        totalSteps={6}
        onBack={handleBack}
        onContinue={handleContinue}
      />
    </>
  );
};

export default SkipSelectionPage; 