import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, Info } from 'lucide-react';
import SignInButton from '../components/SignInButton';
import WelcomeModal from '../components/WelcomeModal';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

function Landing() {
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);

  useEffect(() => {
    // Set status bar for native apps
    const setupNative = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#000000' });
          await SplashScreen.hide();
        } catch (error) {
          console.error('Error setting up native UI:', error);
        }
      }
    };
    
    setupNative();
    
    // Check if this is the user's first visit
    const hasVisitedBefore = localStorage.getItem('pitbox-has-visited');
    if (!hasVisitedBefore) {
      setShowWelcomeModal(true);
      localStorage.setItem('pitbox-has-visited', 'true');
    }
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="relative w-full max-w-md mx-auto mb-8">
          <img 
            src="/android-icon-512-512.png" 
            alt="PIT-BOX.COM Logo" 
            width="800"
            height="240"
            className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-brand-gold">
          Welcome to PIT-BOX.COM
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your Digital Crew Chief for Racing Excellence
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/home')}
            className="w-full btn-primary flex items-center justify-center gap-2 text-lg"
          >
            <LogIn className="w-5 h-5" />
            Get Started
          </button>

          <Link 
            to="/home" 
            className="w-full btn-secondary block text-center"
          >
            Continue as Guest
          </Link>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-1">
            <Info className="w-4 h-4" />
            <span>
              {Capacitor.isNativePlatform() 
                ? 'Native app version' 
                : 'Web version'}
            </span>
          </div>
        </div>

        {/* Hidden sign-in trigger */}
        <SignInButton className="hidden sign-in-trigger" />
        
        {/* Welcome Modal */}
        <WelcomeModal 
          isOpen={showWelcomeModal}
          onClose={handleCloseWelcomeModal}
        />
      </div>
    </div>
  );
}

export default Landing;