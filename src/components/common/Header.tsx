import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, User, Menu, X } from "lucide-react";

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
      <div className="bg-primary-700 backdrop-blur-sm text-white text-xs sm:text-sm py-2.5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <motion.a
              href="tel:01502123456"
              className="flex items-center space-x-2 hover:text-white/80 transition-all duration-300 touch-target-min-44 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              </div>
              <span className="hidden xs:inline sm:inline font-medium">
                01502 123 456
              </span>
              <span className="xs:hidden sm:hidden font-medium">Call</span>
            </motion.a>
            <motion.a
              href="mailto:hello@wewantwaste.co.uk"
              className="flex items-center space-x-2 hover:text-white/80 transition-all duration-300 touch-target-min-44 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              </div>
              <span className="hidden sm:inline font-medium">
                hello@wewantwaste.co.uk
              </span>
              <span className="sm:hidden font-medium">Email</span>
            </motion.a>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white/90 font-medium">
              Need help? We're here 7 days a week
            </span>
          </div>
        </div>
      </div>

      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center py-4 sm:py-5">
            <motion.div
              className="flex items-center space-x-3 sm:space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-1 sm:p-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src="/assets/images/REM-Waste-Logo.png"
                  alt="RemWaste Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-900">
                  WeWantWaste
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  Skip Hire Made Simple
                </p>
              </div>
            </motion.div>

            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {[
                { id: "skip-hire", label: "Skip Hire" },
                { id: "waste-collection", label: "Waste Collection" },
                { id: "areas", label: "Areas Covered" },
                { id: "about", label: "About" },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="px-4 py-2.5 text-gray-700 hover:text-primary-600 font-medium rounded-xl hover:bg-gray-50/80 transition-all duration-300 touch-target-min-44 relative group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-primary-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.button>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-3">
              <motion.button
                onClick={onLoginClick}
                className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-primary-600 font-medium rounded-xl hover:bg-gray-50/80 transition-all duration-300 touch-target-min-44 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1 rounded-lg bg-gray-100 group-hover:bg-primary-100 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span>Login</span>
              </motion.button>
              <motion.button
                onClick={onSignupClick}
                className="px-5 lg:px-7 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl touch-target-min-44 relative overflow-hidden group"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Get Quote</span>
              </motion.button>
            </div>

            <motion.button
              onClick={toggleMobileMenu}
              className="md:hidden p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-300 touch-target-min-44"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        <motion.div
          className={`md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100/50 ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            height: isMobileMenuOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="px-4 py-6 space-y-2">
            {[
              { id: "skip-hire", label: "Skip Hire" },
              { id: "waste-collection", label: "Waste Collection" },
              { id: "areas", label: "Areas Covered" },
              { id: "about", label: "About" },
            ].map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium py-3 px-4 rounded-xl transition-all duration-300 touch-target-min-44"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}

            <div className="pt-4 border-t border-gray-200/50 space-y-3">
              <motion.button
                onClick={onLoginClick}
                className="w-full text-left flex items-center space-x-3 py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-all duration-300 touch-target-min-44 group"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-primary-100 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span>Login</span>
              </motion.button>
              <motion.button
                onClick={onSignupClick}
                className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 text-center touch-target-min-44 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Quote
              </motion.button>
            </div>
          </div>
        </motion.div>
      </header>
    </>
  );
};

export default Header;
