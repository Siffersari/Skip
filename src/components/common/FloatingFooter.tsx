import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  AlertTriangle,
  ChevronUp,
  Eye
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
  const [showDetails, setShowDetails] = useState(false);
  const [showHoverWarning, setShowHoverWarning] = useState(false);

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

  const handleContinueClick = useCallback(() => {
    if (!showDetails && selectedSkip) {
      // If details aren't shown, show them briefly before continuing
      setShowDetails(true);
      setTimeout(() => {
        onContinue();
      }, 1500); // Give user time to see the important info
    } else {
      onContinue();
    }
  }, [showDetails, selectedSkip, onContinue]);

  const renderFooterContent = useCallback((isFloating: boolean) => {
    return (
      <div className={`
        ${isFloating 
          ? 'bg-white/95 backdrop-blur-md shadow-2xl border-t border-gray-200/50' 
          : 'bg-white border border-gray-200 shadow-lg'
        }
        ${isFloating ? 'px-3 py-2' : 'px-4 py-3'}
        rounded-t-xl transition-all duration-300
        ${className}
      `}>
        {/* Compact Main Content */}
        <div className="flex items-center justify-between space-x-3">
          {/* Selection Summary - More Compact */}
          {selectedSkip ? (
            <motion.div 
              className="flex-1 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-gray-900 truncate">
                        {selectedSkip.display_name || `${selectedSkip.size} Yard Skip`}
                      </h3>
                      <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-gray-600 mt-0.5">
                        <span>{selectedSkip.size} yd³</span>
                        <span>•</span>
                        <span>{selectedSkip.hire_period_days}d</span>
                        {isFloating && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium hidden sm:inline">
                              Step {currentStep}/{totalSteps}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <div className="text-right">
                        <div className="text-sm sm:text-base font-bold text-primary-600">
                          {formatCurrency(selectedSkip.total_price)}
                        </div>
                        <div className="text-xs text-gray-500">inc. VAT</div>
                      </div>
                      {!isFloating && (
                        <motion.button
                          onClick={() => setShowDetails(!showDetails)}
                          className="p-1.5 hover:bg-gray-100 rounded-md transition-colors relative"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          animate={{ 
                            scale: !showDetails ? [1, 1.1, 1] : 1,
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: !showDetails ? Infinity : 0,
                            repeatDelay: 3
                          }}
                        >
                          <motion.div
                            animate={{ rotate: showDetails ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                          </motion.div>
                          
                          {/* Attention-drawing pulse */}
                          {!showDetails && (
                            <motion.div
                              className="absolute inset-0 rounded-md bg-orange-400"
                              initial={{ opacity: 0, scale: 1 }}
                              animate={{ 
                                opacity: [0, 0.3, 0],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                            />
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="flex-1 min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center space-x-2.5">
                <div className="flex-shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Select a skip size</div>
                  <div className="text-xs text-gray-500">Choose from {currentStep > 1 ? 'available' : 'our'} options above</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Compact Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <motion.button
              onClick={onBack}
              className="flex items-center space-x-1.5 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={handleContinueClick}
                onMouseEnter={() => !showDetails && selectedSkip && setShowHoverWarning(true)}
                onMouseLeave={() => setShowHoverWarning(false)}
                disabled={!selectedSkip}
                className={`
                  flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 min-w-[100px] relative overflow-hidden
                  ${selectedSkip
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md border border-primary-600'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }
                `}
                whileHover={selectedSkip ? { scale: 1.02 } : {}}
                whileTap={selectedSkip ? { scale: 0.98 } : {}}
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
                
                {/* Subtle warning indicator when details not shown */}
                {selectedSkip && !showDetails && !isFloating && (
                  <motion.div
                    className="absolute top-0 right-0 w-2 h-2 bg-orange-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity
                    }}
                  />
                )}
              </motion.button>

              {/* Hover warning tooltip */}
              <AnimatePresence>
                {showHoverWarning && selectedSkip && !showDetails && !isFloating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10"
                  >
                    <div className="flex items-center space-x-1.5">
                      <Eye className="w-3 h-3" />
                      <span>Click ↑ to view important details first</span>
                    </div>
                    <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Expandable Details Section - Only when not floating */}
        <AnimatePresence>
          {!isFloating && showDetails && selectedSkip && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t border-gray-200"
            >
              {/* Important disclaimer first */}
              <motion.div 
                className="mb-3 flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-800 mb-1">
                    Important: Please review before continuing
                  </p>
                  <p className="text-xs text-amber-700">
                    Skip images may not reflect exact specifications. Colors and accessories may vary. 
                    Actual skip delivered may differ slightly from images shown.
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs mb-3">
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-gray-600">
                    {selectedSkip.allowed_on_road ? 'Road placement OK' : 'Private property only'}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-gray-600">
                    {selectedSkip.allows_heavy_waste ? 'Heavy waste OK' : 'Light waste only'}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <span className="text-gray-600">Same/next day delivery</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar for floating state only on mobile */}
        {isFloating && (
          <div className="mt-2 md:hidden">
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <motion.div
                className="bg-primary-600 h-1 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }, [selectedSkip, currentStep, totalSteps, progressPercentage, onBack, handleContinueClick, className, showDetails, showHoverWarning]);

  return (
    <>
      {/* Fixed Footer at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
        {renderFooterContent(shouldFloat)}
      </div>

      {/* Reduced Spacer for footer content - responsive */}
      <div className={`${shouldFloat ? 'h-14 sm:h-16' : showDetails ? 'h-32 sm:h-36' : 'h-20 sm:h-24'} transition-all duration-300`} />
    </>
  );
});

FloatingFooter.displayName = 'FloatingFooter';

export default FloatingFooter; 