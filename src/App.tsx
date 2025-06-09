import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ErrorBoundary, ToastProvider } from './components/common';
import { SkipSelectionPage } from './pages';
import MainLayout from './layouts/MainLayout';
import { Skip } from './types';
import { formatCurrency } from './utils';

function App() {
  useEffect(() => {
    document.title = 'WeWantWaste - Skip Hire Made Simple | Choose Your Skip Size';
  }, []);

  const handleBack = () => {
    return;
  };

  const handleContinue = (selectedSkip: Skip) => {
    toast.success(
      `Great choice! ${selectedSkip.display_name} for ${formatCurrency(selectedSkip.total_price)}`,
      { duration: 3000, icon: '🎉' }
    );
    return;
  };

  const handleLogin = () => {
    toast(
      'Login functionality coming soon! We\'ll notify you when ready.',
      {
        duration: 4000,
        icon: '🔒',
        style: {
          background: '#3B82F6',
          color: 'white',
        },
      }
    );
  };

  const handleSignup = () => {
    toast.success(
      'Get your instant quote! Our team will contact you within 2 hours.',
      {
        duration: 5000,
        icon: '📞',
      }
    );
  };

  return (
    <ToastProvider>
      <ErrorBoundary>
        <MainLayout 
          onLoginClick={handleLogin}
          onSignupClick={handleSignup}
        >
          <SkipSelectionPage 
            onBack={handleBack}
            onContinue={handleContinue}
          />
        </MainLayout>
        <SpeedInsights />
      </ErrorBoundary>
    </ToastProvider>
  );
}

export default App;
