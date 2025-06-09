import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  User, 
  Menu, 
  X,
  Recycle
} from 'lucide-react';

interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (section: string) => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-800 text-white text-xs sm:text-sm py-2">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 sm:space-x-6">
            <a 
              href="tel:01502123456" 
              className="flex items-center space-x-1.5 sm:space-x-2 hover:text-primary-200 transition-colors touch-target-min-44"
            >
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">01502 123 456</span>
              <span className="xs:hidden sm:hidden">Call</span>
            </a>
            <a 
              href="mailto:hello@wewantwaste.co.uk" 
              className="flex items-center space-x-1.5 sm:space-x-2 hover:text-primary-200 transition-colors touch-target-min-44"
            >
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">hello@wewantwaste.co.uk</span>
              <span className="sm:hidden">Email</span>
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-primary-200">Need help? We're here 7 days a week</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <motion.div 
              className="flex items-center space-x-2 sm:space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-md">
                <Recycle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">WeWantWaste</h1>
                <p className="text-xs sm:text-sm text-gray-500">Skip Hire Made Simple</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button 
                onClick={() => handleNavClick('skip-hire')}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors touch-target-min-44"
              >
                Skip Hire
              </button>
              <button 
                onClick={() => handleNavClick('waste-collection')}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors touch-target-min-44"
              >
                Waste Collection
              </button>
              <button 
                onClick={() => handleNavClick('areas')}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors touch-target-min-44"
              >
                Areas Covered
              </button>
              <button 
                onClick={() => handleNavClick('about')}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors touch-target-min-44"
              >
                About
              </button>
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={onLoginClick}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors touch-target-min-44"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
              <motion.button
                onClick={onSignupClick}
                className="px-4 lg:px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md touch-target-min-44"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Quote
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target-min-44"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className={`md:hidden bg-white border-t border-gray-200 ${
            isMobileMenuOpen ? 'block' : 'hidden'
          }`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4 space-y-2">
            <button 
              onClick={() => handleNavClick('skip-hire')}
              className="block w-full text-left text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium py-3 px-2 rounded-lg transition-colors touch-target-min-44"
            >
              Skip Hire
            </button>
            <button 
              onClick={() => handleNavClick('waste-collection')}
              className="block w-full text-left text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium py-3 px-2 rounded-lg transition-colors touch-target-min-44"
            >
              Waste Collection
            </button>
            <button 
              onClick={() => handleNavClick('areas')}
              className="block w-full text-left text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium py-3 px-2 rounded-lg transition-colors touch-target-min-44"
            >
              Areas Covered
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className="block w-full text-left text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium py-3 px-2 rounded-lg transition-colors touch-target-min-44"
            >
              About
            </button>
            <div className="pt-3 border-t border-gray-200 space-y-3">
              <button
                onClick={onLoginClick}
                className="w-full text-left flex items-center space-x-2 py-3 px-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium rounded-lg transition-colors touch-target-min-44"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </button>
              <button
                onClick={onSignupClick}
                className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-center touch-target-min-44"
              >
                Get Quote
              </button>
            </div>
          </div>
        </motion.div>
      </header>
    </>
  );
};

export default Header; 