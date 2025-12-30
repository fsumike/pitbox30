import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Info } from 'lucide-react';
import SignInButton from '../components/SignInButton';
import WelcomeModal from '../components/WelcomeModal';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

function Landing() {
  const [showWelcomeModal, setShowWelcomeModal] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="liquid-orb liquid-orb-gold w-96 h-96 -top-32 -left-32 fixed z-0" />
      <div className="liquid-orb liquid-orb-amber w-80 h-80 -bottom-20 -right-20 fixed z-0" style={{ animationDelay: '-5s' }} />
      <div className="liquid-orb liquid-orb-gold w-64 h-64 top-1/2 right-1/4 fixed z-0" style={{ animationDelay: '-10s' }} />

      <div className="liquid-glass p-8 w-full max-w-lg text-center relative z-10">
        <div className="relative w-full max-w-xs mx-auto mb-8">
          <div className="absolute inset-0 bg-amber-400/30 blur-3xl rounded-full scale-110" />
          <img
            src="/android-icon-512-512.png"
            alt="PIT-BOX.COM Logo"
            width="800"
            height="240"
            className="w-full h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300 relative z-10"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
          Welcome to PIT-BOX.COM
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your Digital Crew Chief for Racing Excellence
        </p>

        <div className="space-y-4 relative z-10">
          <button
            onClick={() => navigate('/home')}
            className="w-full liquid-glass-btn flex items-center justify-center gap-2 text-lg"
          >
            <LogIn className="w-5 h-5" />
            Get Started
          </button>

          <Link
            to="/home"
            className="w-full liquid-glass-card block text-center py-3 hover:scale-105 transition-transform"
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

        <SignInButton className="hidden sign-in-trigger" />

        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={handleCloseWelcomeModal}
        />
      </div>
    </div>
  );
}

export default Landing;