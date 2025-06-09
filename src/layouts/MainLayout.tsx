import React from 'react';
import Header from '../components/common/Header';
import Stepper from '../components/common/Stepper';
import { PROGRESS_STEPS } from '../constants';

interface MainLayoutProps {
  children: React.ReactNode;
  showStepper?: boolean;
  currentStep?: number;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showStepper = true,
  currentStep = 3,
  onLoginClick,
  onSignupClick
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onLoginClick={onLoginClick}
        onSignupClick={onSignupClick}
      />
      
      {showStepper && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <Stepper 
              steps={PROGRESS_STEPS} 
              currentStep={currentStep}
            />
          </div>
        </div>
      )}
      
      <main className="flex-1 pb-32">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 