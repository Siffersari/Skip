import React from 'react';
import { motion } from 'framer-motion';

const CheckIcon = () => (
  <svg
    className="w-4 h-4 sm:w-5 sm:h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);


interface StepProps {
  index: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: (stepIndex: number) => void;
  isClickable: boolean;
}

const Step: React.FC<StepProps> = ({ index, title, isActive, isCompleted, onClick, isClickable }) => {
  return (
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <motion.button
        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold transition-all duration-300 text-sm ${
          isCompleted
            ? 'bg-success-500 text-white'
            : isActive
            ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-sm'
            : 'bg-white border border-neutral-300 text-neutral-500'
        } ${isClickable ? 'cursor-pointer hover:scale-105 touch-target-min-44' : 'cursor-default'}`}
        onClick={() => isClickable && onClick && onClick(index + 1)}
        disabled={!isClickable}
        whileHover={isClickable ? { scale: isActive ? 1.05 : 1.02 } : {}}
        whileTap={isClickable ? { scale: 0.98 } : {}}
      >
        {isCompleted ? <CheckIcon /> : index + 1}
      </motion.button>
      <motion.p
        className={`text-xs sm:text-sm ml-2 sm:ml-3 transition-all duration-300 ${
          isActive ? 'text-secondary-900 font-bold' : isCompleted ? 'text-secondary-700 font-semibold' : 'text-neutral-500'
        }`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
      >
        {title}
      </motion.p>
    </motion.div>
  );
};

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({ 
  steps, 
  currentStep, 
  onStepClick,
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Desktop View */}
      <div className="hidden md:block py-3 lg:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <motion.div 
            className="w-full py-2 lg:px-6 bg-gradient-to-r from-success-50 via-neutral-50 to-neutral-100 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center px-4">
              {steps.map((title, index) => (
                <React.Fragment key={index}>
                  <Step
                    index={index}
                    title={title}
                    isActive={index + 1 === currentStep}
                    isCompleted={index + 1 < currentStep}
                    onClick={onStepClick}
                    isClickable={onStepClick ? (index + 1 < currentStep || index + 1 === currentStep) : false}
                  />
                  
                  {index < steps.length - 1 && (
                    <motion.div
                      className={`flex-auto border-t-2 border-dashed transition-all duration-300 mx-2 lg:mx-4 ${
                        index + 1 < currentStep ? 'border-success-500' : 'border-neutral-300'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <motion.div 
            className="bg-gradient-to-r from-success-50 via-neutral-50 to-neutral-100 rounded-xl shadow-sm px-4 py-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-3">
              <motion.div 
                className="text-sm font-semibold text-secondary-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                Step {currentStep} of {steps.length}
              </motion.div>
              <motion.div 
                className="text-sm font-medium text-neutral-600"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {Math.round((currentStep / steps.length) * 100)}%
              </motion.div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 rounded-full h-2 mb-4 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-accent-500 to-accent-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            {/* Current Step Display */}
            <div className="text-center mb-4">
              <motion.div 
                className="flex items-center justify-center mb-3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg bg-gradient-to-r from-accent-500 to-accent-600 text-white border-3 border-white shadow-lg">
                  {currentStep}
                </div>
              </motion.div>
              
              <motion.div 
                className="text-lg font-bold text-secondary-900 mb-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {steps[currentStep - 1]}
              </motion.div>
            </div>
            
            {/* Enhanced Navigation Context */}
            <motion.div 
              className="flex justify-between items-center px-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {/* Previous Step */}
              <div className="flex items-center space-x-2 flex-1">
                {currentStep > 1 ? (
                  <>
                   
                    <div className="text-left min-w-0 flex-1">
                      <div className="text-xs text-success-600 font-medium">Previous</div>
                      <div className="text-sm font-semibold text-secondary-700 truncate">
                        {steps[currentStep - 2]}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1" />
                )}
              </div>

              {/* Divider */}
              {currentStep > 1 && currentStep < steps.length && (
                <div className="w-0.5 h-8 bg-neutral-300 mx-4" />
              )}

              {/* Next Step */}
              <div className="flex items-center space-x-2 flex-1 justify-end">
                {currentStep < steps.length ? (
                  <>
                    <div className="text-right min-w-0 flex-1">
                      <div className="text-xs text-neutral-500 font-medium">Next</div>
                      <div className="text-sm font-semibold text-secondary-700 truncate">
                        {steps[currentStep]}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Stepper; 