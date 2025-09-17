import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MainNavigation = ({ processingState = null, resultCount = 0, exportInProgress = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Verify Emails', path: '/email-verification-hub', icon: 'Upload', tooltip: 'Start new email verification' },
    { label: 'View Results', path: '/results-dashboard', icon: 'BarChart3', tooltip: 'Analyze verification results' }
  ];

  const isActive = (path) => location?.pathname === path;
  const handleNavigation = (path) => { navigate(path); setIsMobileMenuOpen(false); };
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => setIsMobileMenuOpen(false), [location?.pathname]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-gray-800 shadow-md">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-400 rounded-full flex items-center justify-center shadow-md">
              <Icon name="Mail" size={22} color="white" />
            </div>
            <span className="text-white text-xl font-semibold font-heading">
              Jedi Tech Email Verifier
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActive(item?.path) ? "default" : "ghost"}
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={18}
                className={`transition-smooth text-white 
                  ${isActive(item?.path) ? "bg-gradient-to-r from-blue-500 to-green-400 text-black rounded-full px-4 py-2" : "hover:bg-white/10 rounded-full px-4 py-2"}`}
                title={item?.tooltip}
              >
                {item?.label}
              </Button>
            ))}
          </nav>

          {/* Status Badges */}
          <div className="hidden lg:flex items-center space-x-2">
            {processingState && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-700/30 text-white rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{processingState?.message || 'Processing...'}</span>
                {processingState?.progress && <span className="text-sm font-medium">{processingState?.progress}%</span>}
              </div>
            )}
            {resultCount > 0 && location?.pathname === '/results-dashboard' && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-600/30 text-white rounded-full backdrop-blur-sm">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">{resultCount?.toLocaleString()} results</span>
              </div>
            )}
            {exportInProgress && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-600/30 text-white rounded-full backdrop-blur-sm">
                <Icon name="Download" size={16} className="animate-pulse" />
                <span className="text-sm font-medium">Exporting...</span>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="md:hidden text-white"
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={22}
          />
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={toggleMobileMenu}></div>
            <div className="fixed top-16 left-0 right-0 bg-black/50 backdrop-blur-md border-t border-gray-800 shadow-lg animate-slide-in">
              <nav className="px-4 py-4 space-y-2">
                {navigationItems?.map((item) => (
                  <Button
                    key={item?.path}
                    variant={isActive(item?.path) ? "default" : "ghost"}
                    onClick={() => handleNavigation(item?.path)}
                    iconName={item?.icon}
                    iconPosition="left"
                    iconSize={18}
                    fullWidth
                    className={`justify-start transition-smooth text-white 
                      ${isActive(item?.path) ? "bg-gradient-to-r from-blue-500 to-green-400 text-black rounded-full px-4 py-2" : "hover:bg-white/10 rounded-full px-4 py-2"}`}
                  >
                    {item?.label}
                  </Button>
                ))}

                {resultCount > 0 && location?.pathname === '/results-dashboard' && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-600/30 text-white rounded-lg backdrop-blur-sm mt-4">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">{resultCount?.toLocaleString()} results available</span>
                  </div>
                )}

                {exportInProgress && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-600/30 text-white rounded-lg backdrop-blur-sm mt-2">
                    <Icon name="Download" size={16} className="animate-pulse" />
                    <span className="text-sm font-medium">Export in progress...</span>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default MainNavigation;
