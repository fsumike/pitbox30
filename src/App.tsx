import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import { Sun, Moon, Menu, X as MenuX, Loader2 } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import { StripeProvider } from './contexts/StripeContext';
import { NavVisibilityProvider, useNavVisibility } from './contexts/NavVisibilityContext';
import SignInButton from './components/SignInButton';
import PWAUpdate from './components/PWAUpdate';
import { useAuth } from './contexts/AuthContext';
import { TrackDetectionBanner } from './components/TrackDetectionBanner';
import { usePushNotifications } from './hooks/usePushNotifications';
import VideoSplash from './components/VideoSplash';
import { liveUpdateService } from './lib/capawesome-live-update';

// Critical pages loaded immediately
import Landing from './pages/Landing';
import Home from './pages/Home';
import SignIn from './pages/SignIn';

// Lazy load all other pages for better performance
const WinglessSprints = lazy(() => import('./pages/WinglessSprints'));
const CrateSprints = lazy(() => import('./pages/CrateSprints'));
const Sprint360 = lazy(() => import('./pages/Sprint360'));
const Sprint410 = lazy(() => import('./pages/Sprint410'));
const NonWinged410 = lazy(() => import('./pages/NonWinged410'));
const DirtModified2 = lazy(() => import('./pages/DirtModified2'));
const UMPModified = lazy(() => import('./pages/UMPModified'));
const IMCAModifieds = lazy(() => import('./pages/IMCAModifieds'));
const IMCASportMods = lazy(() => import('./pages/IMCASportMods'));
const BModified = lazy(() => import('./pages/BModified'));
const Micro600 = lazy(() => import('./pages/Micro600'));
const MiniSprint = lazy(() => import('./pages/MiniSprint'));
const JrSprint = lazy(() => import('./pages/JrSprint'));
const QuarterMidget = lazy(() => import('./pages/QuarterMidget'));
const FocusMidget = lazy(() => import('./pages/FocusMidget'));
const OutlawKart = lazy(() => import('./pages/OutlawKart'));
const LO206Kart = lazy(() => import('./pages/LO206Kart'));
const LateDirt = lazy(() => import('./pages/LateDirt'));
const CrateLateMod = lazy(() => import('./pages/CrateLateMod'));
const SuperLateModel = lazy(() => import('./pages/SuperLateModel'));
const StreetStock = lazy(() => import('./pages/StreetStock'));
const RestrictedBoxStock = lazy(() => import('./pages/RestrictedBoxStock'));
const BoxStock = lazy(() => import('./pages/BoxStock'));
const Intermediate250 = lazy(() => import('./pages/Intermediate250'));
const OpenIntermediate = lazy(() => import('./pages/OpenIntermediate'));
const OpenClass = lazy(() => import('./pages/OpenClass'));
const SportsmanClass = lazy(() => import('./pages/SportsmanClass'));
const CagedCloneClass = lazy(() => import('./pages/CagedCloneClass'));
const Contact = lazy(() => import('./pages/Contact'));
const Affiliates = lazy(() => import('./pages/Affiliates'));
const PartnerWithUs = lazy(() => import('./pages/PartnerWithUs'));
const SwapMeet = lazy(() => import('./pages/SwapMeet'));
const Profile = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const RacingCommunity = lazy(() => import('./pages/RacingCommunity'));
const PostView = lazy(() => import('./pages/PostView'));
const TireTool = lazy(() => import('./pages/TireTool'));
const Friends = lazy(() => import('./pages/Friends'));
const SavedSetups = lazy(() => import('./pages/SavedSetups'));
const Subscription = lazy(() => import('./pages/Subscription'));
const SubscriptionSuccess = lazy(() => import('./pages/SubscriptionSuccess'));
const SubscriptionCancel = lazy(() => import('./pages/SubscriptionCancel'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const Privacy = lazy(() => import('./pages/Privacy'));
const AdvertiserTerms = lazy(() => import('./pages/AdvertiserTerms'));
const MotorWear = lazy(() => import('./pages/MotorWear'));
const MaintenanceChecklist = lazy(() => import('./pages/MaintenanceChecklist'));
const Tools = lazy(() => import('./pages/Tools'));
const SocialMedia = lazy(() => import('./pages/SocialMedia'));
const QRCodeDownload = lazy(() => import('./pages/QRCodeDownload'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-brand-gold mx-auto mb-4" />
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const vehicleCategories = {
  'Vehicles': [
    {
      name: 'Sprint Cars',
      subcategories: [
        { name: 'Wingless Sprints', path: '/wingless' },
        { name: 'Crate Sprints', path: '/crate' },
        { name: '360 Sprints', path: '/360' },
        { name: '410 Sprints', path: '/410' },
        { name: 'Non-Winged 410 Sprints', path: '/nonwinged410' },
        { name: '600 Micro', path: '/600' },
        { name: 'Mini Sprint', path: '/mini' },
        { name: 'Jr Sprint', path: '/jr' }
      ]
    },
    {
      name: 'Midget Cars',
      subcategories: [
        { name: 'Quarter Midget', path: '/quarter' },
        { name: 'Focus Midget', path: '/focus' }
      ]
    },
    {
      name: 'Modifieds',
      subcategories: [
        { name: 'Dirt Modified 2', path: '/modified2' },
        { name: 'UMP Modifieds', path: '/ump-modified' },
        { name: 'IMCA Modifieds', path: '/imca-modified' },
        { name: 'IMCA SportMods', path: '/imca-sportmod' },
        { name: 'B-Modifieds', path: '/b-modified' }
      ]
    },
    {
      name: 'Late Models',
      subcategories: [
        { name: 'Late Model Dirt', path: '/latemodel' },
        { name: 'Crate Late Models', path: '/crate-latemodel' },
        { name: 'Super Late Model', path: '/super-latemodel' }
      ]
    },
    {
      name: 'Stock Cars',
      subcategories: [
        { name: 'Street Stocks', path: '/street-stock' }
      ]
    },
    {
      name: 'Youth Racing / Kart',
      subcategories: [
        { name: 'Outlaw Kart', path: '/outlaw' },
        { name: 'LO206 Kart', path: '/lo206-kart' },
        { name: 'Restricted Box Stock', path: '/restricted-boxstock' },
        { name: 'Box Stock Class', path: '/boxstock' },
        { name: '250 Intermediate', path: '/intermediate250' },
        { name: 'Open Intermediate', path: '/open-intermediate' },
        { name: 'Open Class', path: '/open-class' },
        { name: 'Sportsman Class', path: '/sportsman' },
        { name: 'Caged Clone Class', path: '/caged-clone' }
      ]
    }
  ]
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideNav, setHideNav] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);
  const [showVideoSplash, setShowVideoSplash] = useState(true);
  const [hasSeenVideo, setHasSeenVideo] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { showNav } = useNavVisibility();
  const isLandingPage = location.pathname === '/';

  usePushNotifications();

  useEffect(() => {
    liveUpdateService.initialize();
  }, []);

  useEffect(() => {
    const seen = sessionStorage.getItem('hasSeenVideoSplash');
    if (seen === 'true') {
      setHasSeenVideo(true);
      setShowVideoSplash(false);
    }
  }, []);

  const handleVideoComplete = () => {
    setShowVideoSplash(false);
    setHasSeenVideo(true);
    sessionStorage.setItem('hasSeenVideoSplash', 'true');
  };

  const minSwipeDistance = 50;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHideNav(true);
      } else {
        setHideNav(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndY(null);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStartY || !touchEndY) return;
    
    const distance = touchStartY - touchEndY;
    const isUpSwipe = distance > minSwipeDistance;
    
    if (isUpSwipe) {
      closeMenu();
    }
  };

  // Show video splash on first load (only once per session)
  if (showVideoSplash && !hasSeenVideo) {
    return <VideoSplash onComplete={handleVideoComplete} />;
  }

  // Simplified navigation logic - always allow access to prevent blocking
  if (user && isLandingPage) {
    return <Navigate to="/home" replace />;
  }

  if (isLandingPage) {
    return (
      <div className={darkMode ? 'dark' : 'light'}>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
        <PWAUpdate />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light'}`}>
      <div className="bg-pattern-wrapper">
        <div className="bg-pattern"></div>
        <div className="bg-pattern-overlay"></div>
      </div>
      
      <TrackDetectionBanner />

      {showNav && (
        <nav
          className={`fixed top-safe-top left-0 right-0 z-[1000] px-4 py-2 transition-all duration-300 ${
            hideNav && !menuOpen ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="glass-nav rounded-2xl backdrop-blur-lg border border-white/10 shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center">
                  <NavLink 
                    to="/home" 
                    className="flex items-center transition-transform hover:scale-105"
                  >
                    <img 
                      src="/android-icon-192-192.png" 
                      alt="PIT-BOX.COM Logo" 
                      className="h-10 w-auto drop-shadow-lg"
                    />
                  </NavLink>
                </div>

                <div className="hidden md:flex md:items-center md:space-x-1">
                  <NavLink
                    to="/home"
                    className={({ isActive }) => `
                      nav-link px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-100/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/community"
                    className={({ isActive }) => `
                      nav-link px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-100/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Pit Community
                  </NavLink>
                  <NavLink
                    to="/swap-meet"
                    className={({ isActive }) => `
                      nav-link px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-100/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Swap Meet
                  </NavLink>
                  <NavLink
                    to="/tools"
                    className={({ isActive }) => `
                      nav-link px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-100/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Racing Tools
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) => `
                      nav-link px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-100/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Contact
                  </NavLink>
                  <NavLink
                    to="/affiliates"
                    className={({ isActive }) => `
                      nav-link px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-100/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Affiliates
                  </NavLink>
                  <NavLink
                    to="/social"
                    className={({ isActive }) => `
                      nav-link px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-100/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Follow Us
                  </NavLink>

                  <div className="ml-2 pl-2 border-l border-gray-200/10">
                    <SignInButton className="nav-link" />
                  </div>

                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors ml-2 text-white"
                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>

                <div className="md:hidden flex items-center gap-2">
                  <SignInButton className="nav-link" />
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  >
                    {menuOpen ? <MenuX className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>

            <div 
              className={`
                fixed inset-x-4 top-24 z-50 transform transition-all duration-300 origin-top
                ${menuOpen ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none'}
              `}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div className="glass-nav rounded-2xl backdrop-blur-lg border border-white/10 shadow-lg overflow-hidden">
                <div className="p-4 space-y-1">
                  <NavLink
                    to="/home"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/community"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Pit Community
                  </NavLink>
                  <NavLink
                    to="/swap-meet"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Swap Meet
                  </NavLink>
                  <NavLink
                    to="/tools"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Racing Tools
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Contact
                  </NavLink>
                  <NavLink
                    to="/affiliates"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Affiliates
                  </NavLink>
                  <NavLink
                    to="/social"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10'}
                    `}
                    onClick={closeMenu}
                  >
                    Follow Us
                  </NavLink>

                  <div className="h-px bg-white/20 my-2"></div>

                  <button
                    onClick={() => {
                      toggleDarkMode();
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white font-medium"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="pt-24 pb-32 md:pb-8 px-4 max-w-7xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/partner-with-us" element={<PartnerWithUs />} />
          <Route path="/swap-meet" element={<SwapMeet />} />
          <Route path="/community" element={<RacingCommunity />} />
          <Route path="/community/post/:postId" element={<PostView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/advertiser-terms" element={<AdvertiserTerms />} />
          <Route path="/motor-wear" element={<MotorWear />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/social" element={<SocialMedia />} />
          <Route path="/qr-download" element={<QRCodeDownload />} />
          
          <Route path="/wingless" element={<WinglessSprints />} />
          <Route path="/crate" element={<CrateSprints />} />
          <Route path="/360" element={<Sprint360 />} />
          <Route path="/410" element={<Sprint410 />} />
          <Route path="/nonwinged410" element={<NonWinged410 />} />
          <Route path="/600" element={<Micro600 />} />
          <Route path="/mini" element={<MiniSprint />} />
          <Route path="/jr" element={<JrSprint />} />
          <Route path="/quarter" element={<QuarterMidget />} />
          <Route path="/focus" element={<FocusMidget />} />
          <Route path="/outlaw" element={<OutlawKart />} />
          <Route path="/lo206-kart" element={<LO206Kart />} />
          <Route path="/modified2" element={<DirtModified2 />} />
          <Route path="/ump-modified" element={<UMPModified />} />
          <Route path="/imca-modified" element={<IMCAModifieds />} />
          <Route path="/imca-sportmod" element={<IMCASportMods />} />
          <Route path="/b-modified" element={<BModified />} />
          <Route path="/latemodel" element={<LateDirt />} />
          <Route path="/crate-latemodel" element={<CrateLateMod />} />
          <Route path="/super-latemodel" element={<SuperLateModel />} />
          <Route path="/street-stock" element={<StreetStock />} />
          <Route path="/restricted-boxstock" element={<RestrictedBoxStock />} />
          <Route path="/boxstock" element={<BoxStock />} />
          <Route path="/intermediate250" element={<Intermediate250 />} />
          <Route path="/open-intermediate" element={<OpenIntermediate />} />
          <Route path="/open-class" element={<OpenClass />} />
          <Route path="/sportsman" element={<SportsmanClass />} />
          <Route path="/caged-clone" element={<CagedCloneClass />} />
          <Route path="/tire-tool" element={<TireTool />} />
          
          {/* Add the route for saved setups */}
          <Route path="/setups/:carType" element={<SavedSetups />} />
          
          {/* Add subscription routes */}
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/subscription/cancel" element={<SubscriptionCancel />} />
          <Route path="/maintenance" element={<MaintenanceChecklist />} />

          <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </Suspense>
      </main>

      <PWAUpdate />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <StripeProvider>
            <NavVisibilityProvider>
              <ScrollToTop />
              <App />
            </NavVisibilityProvider>
          </StripeProvider>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;