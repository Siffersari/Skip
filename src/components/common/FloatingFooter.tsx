import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  AlertCircle
} from 'lucide-react';
import { Skip } from '../../types';
import { formatCurrency } from '../../utils';

interface FloatingFooterProps {
  selectedSkip: Skip | null;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  className?: string;
}

const FloatingFooter: React.FC<FloatingFooterProps> = React.memo(({
  selectedSkip,
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  className = ''
}) => {
  const [shouldFloat, setShouldFloat] = useState(false);

  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Float when user has scrolled past the first screen and not near bottom
      const shouldShowFloat = scrollY > windowHeight * 0.5 && 
                             (scrollY + windowHeight) < documentHeight - 100;
      
      setShouldFloat(shouldShowFloat);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderFooterContent = useCallback((isFloating: boolean) => {
    return (
      <div className={`
        ${isFloating ? 'bg-white shadow-xl border-t border-gray-200' : 'bg-white border border-gray-200  shadow-md'}
        ${isFloating ? 'px-4 py-4' : 'p-6'}
        ${className}
      `}>
        {/* Progress indicator for mobile when floating */}
        {isFloating && (
          <div className="mb-4 md:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-xs font-bold text-primary-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5">
              <motion.div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Disclaimer - Only show when not floating on mobile */}
        {!isFloating && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                <strong>Note:</strong> Images may not reflect exact specifications. Colors and accessories may vary.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:justify-between sm:space-x-4">
          {/* Selection Summary */}
          {selectedSkip ? (
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-gray-900 truncate">
                      {selectedSkip.display_name || `${selectedSkip.size} Yard Skip`}
                    </h3>
                    <div className="flex-shrink-0 ml-2 flex items-center">
                      <span className="text-lg font-bold text-primary-600">
                        {formatCurrency(selectedSkip.total_price)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                      {selectedSkip.size} cubic yards
                    </span>
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                      {selectedSkip.hire_period_days} days
                    </span>
                    <span className="hidden sm:flex items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                      {selectedSkip.allowed_on_road ? 'Road placement OK' : 'Private property only'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Info className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">No skip selected</div>
                  <div className="text-xs text-gray-500">Choose a skip size to continue</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 sm:flex-shrink-0">
            <motion.button
              onClick={onBack}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium touch-target-min-44"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>

            <motion.button
              onClick={onContinue}
              disabled={!selectedSkip}
              className={`
                flex items-center justify-center space-x-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 touch-target-min-44 flex-1 sm:flex-initial min-w-32
                ${selectedSkip
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md border border-primary-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }
              `}
              whileHover={selectedSkip ? { scale: 1.02 } : {}}
              whileTap={selectedSkip ? { scale: 0.98 } : {}}
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }, [selectedSkip, currentStep, totalSteps, progressPercentage, onBack, onContinue, className]);

  return (
    <>
      {/* Fixed Footer at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
        {renderFooterContent(shouldFloat)}
      </div>

      {/* Spacer for footer content */}
      <div className="h-32 sm:h-36" />
    </>
  );
});

FloatingFooter.displayName = 'FloatingFooter';

export default FloatingFooter; 