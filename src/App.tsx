import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X as MenuX, Loader2, Undo2 } from 'lucide-react';
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
import { useShareTarget } from './hooks/useShareTarget';
import ShareTargetHandler from './components/ShareTargetHandler';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';

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
const Messages = lazy(() => import('./pages/Messages'));
const Notifications = lazy(() => import('./pages/Notifications'));
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
const MyAdvertisements = lazy(() => import('./pages/MyAdvertisements'));
const AdminAdvertisements = lazy(() => import('./pages/AdminAdvertisements'));

import { AdminRoute } from './components/AdminRoute';
import { isDesktopWeb } from './utils/platform';

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
        { name: 'Wingless Sprints (National - Various engines)', path: '/wingless' },
        { name: '305 / Crate Sprints (RaceSaver/602/604)', path: '/crate' },
        { name: '360 Sprints (National - All regions)', path: '/360' },
        { name: '410 Sprints (High Limit - PA/OH/National - WoO)', path: '/410' },
        { name: 'Non-Winged 410 Sprints (Midwest/Southwest - USAC)', path: '/nonwinged410' },
        { name: '600 Micro (National - Winged and Non-Winged)', path: '/600' },
        { name: 'Mini Sprint (West Coast/Midwest)', path: '/mini' },
        { name: 'Jr Sprint (National - Youth 8-15)', path: '/jr' }
      ]
    },
    {
      name: 'Midget Cars',
      subcategories: [
        { name: 'Quarter Midget (National - Youth ages 5-16)', path: '/quarter' },
        { name: 'Focus Midget (National - 1000cc Honda)', path: '/focus' }
      ]
    },
    {
      name: 'Modifieds',
      subcategories: [
        { name: 'Big Block Modified (Northeast - 480ci, 4-link)', path: '/modified2' },
        { name: 'UMP / USMTS Modified (Southern/National Open)', path: '/ump-modified' },
        { name: 'IMCA Modifieds (Midwest/Western - 365ci sealed)', path: '/imca-modified' },
        { name: 'IMCA SportMods (Midwest/Western - Crate)', path: '/imca-sportmod' },
        { name: 'B-Modifieds (Regional - Budget Class)', path: '/b-modified' }
      ]
    },
    {
      name: 'Late Models',
      subcategories: [
        { name: 'Late Model Dirt (Regional - Open motor)', path: '/latemodel' },
        { name: 'Crate Late Models (Southeast/Midwest - 604/525)', path: '/crate-latemodel' },
        { name: 'Super Late Model (National - WoO/Lucas Oil)', path: '/super-latemodel' }
      ]
    },
    {
      name: 'Stock Cars',
      subcategories: [
        { name: 'Street Stocks (Regional - Factory frame)', path: '/street-stock' }
      ]
    },
    {
      name: 'Youth Racing / Kart',
      subcategories: [
        { name: 'Outlaw Kart (National - Various classes)', path: '/outlaw' },
        { name: 'LO206 Kart (National - Spec motor)', path: '/lo206-kart' },
        { name: 'Restricted Box Stock (Regional - Ages 5-7)', path: '/restricted-boxstock' },
        { name: 'Box Stock Class (Regional - Clone/Predator)', path: '/boxstock' },
        { name: '250 Intermediate (Regional - Ages 12-15)', path: '/intermediate250' },
        { name: 'Open Intermediate (Regional)', path: '/open-intermediate' },
        { name: 'Open Class (Regional - Unrestricted)', path: '/open-class' },
        { name: 'Sportsman Class (Regional - Entry level)', path: '/sportsman' },
        { name: 'Caged Clone Class (Regional - Clone motor)', path: '/caged-clone' }
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
  const [showVideoSplash, setShowVideoSplash] = useState(() => {
    const seen = localStorage.getItem('hasSeenVideoSplash');
    return seen !== 'true';
  });
  const [hasSeenVideo, setHasSeenVideo] = useState(() => {
    const seen = localStorage.getItem('hasSeenVideoSplash');
    return seen === 'true';
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { showNav } = useNavVisibility();
  const isLandingPage = location.pathname === '/';
  const { sharedContent, clearSharedContent, hasSharedContent } = useShareTarget();

  usePushNotifications();

  useEffect(() => {
    liveUpdateService.initialize();
  }, []);

  const handleVideoComplete = () => {
    setShowVideoSplash(false);
    setHasSeenVideo(true);
    localStorage.setItem('hasSeenVideoSplash', 'true');
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

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  const showBackButton = !['/', '/home', '/signin'].includes(location.pathname);

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
    <div className={`min-h-screen overflow-x-hidden ${darkMode ? 'dark' : 'light'}`} style={{ touchAction: 'pan-y', maxWidth: '100vw' }}>
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

                <div className="hidden lg:flex lg:items-center lg:space-x-1">
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

                  {isDesktopWeb() && userProfile?.is_admin && (
                    <NavLink
                      to="/admin/advertisements"
                      className={({ isActive }) => `
                        nav-link px-4 py-2 rounded-lg transition-all duration-200 text-white font-medium
                        ${isActive ? 'bg-brand-gold/10 text-brand-gold' : 'hover:bg-gray-100/10'}
                      `}
                      onClick={closeMenu}
                    >
                      Admin
                    </NavLink>
                  )}

                  <div className="ml-2 pl-2 border-l border-gray-200/10 flex items-center gap-3">
                    <SignInButton className="nav-link" />

                    <div className="flex items-center gap-1">
                      <button
                        onClick={toggleDarkMode}
                        className="p-1.5 rounded-lg hover:bg-gray-100/10 transition-colors"
                        aria-label="Toggle light mode"
                      >
                        <Sun className={`w-5 h-5 ${darkMode ? 'text-yellow-500/40' : 'text-yellow-500'}`} />
                      </button>
                      <button
                        onClick={toggleDarkMode}
                        className="p-1.5 rounded-lg hover:bg-gray-100/10 transition-colors"
                        aria-label="Toggle dark mode"
                      >
                        <Moon className={`w-5 h-5 ${darkMode ? 'text-yellow-500' : 'text-yellow-500/40'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:hidden flex items-center gap-2">
                  {showBackButton && (
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold transition-all duration-200"
                      aria-label="Go back"
                    >
                      <Undo2 className="w-5 h-5" />
                      <span className="font-medium text-sm">Back</span>
                    </button>
                  )}
                  <SignInButton className="nav-link" />
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100/10 transition-colors"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  >
                    {/* ORIGINAL (white icons): {menuOpen ? <MenuX className="w-6 h-6" /> : <Menu className="w-6 h-6" />} */}
                    {/* Updated to yellow/gold for better visibility with translucent background */}
                    {menuOpen ? <MenuX className="w-6 h-6 text-brand-gold" /> : <Menu className="w-6 h-6 text-brand-gold" />}
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`
                fixed inset-x-4 z-50 transition-all duration-300
                ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
              `}
              style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 6rem)'
              }}
            >
              <div className="glass-nav rounded-2xl backdrop-blur-lg border border-white/10 shadow-lg overflow-hidden">
                <div className="p-4 space-y-1">
                  <NavLink
                    to="/home"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10 active:bg-white/20'}
                    `}
                    onClick={closeMenu}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/community"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10 active:bg-white/20'}
                    `}
                    onClick={closeMenu}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Pit Community
                  </NavLink>
                  <NavLink
                    to="/swap-meet"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10 active:bg-white/20'}
                    `}
                    onClick={closeMenu}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Swap Meet
                  </NavLink>
                  <NavLink
                    to="/tools"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10 active:bg-white/20'}
                    `}
                    onClick={closeMenu}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Racing Tools
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10 active:bg-white/20'}
                    `}
                    onClick={closeMenu}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Contact
                  </NavLink>
                  <NavLink
                    to="/affiliates"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10 active:bg-white/20'}
                    `}
                    onClick={closeMenu}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Affiliates
                  </NavLink>
                  <NavLink
                    to="/social"
                    className={({ isActive }) => `
                      block px-4 py-3 rounded-lg transition-all duration-200 text-white font-medium
                      ${isActive ? 'bg-brand-gold/20 text-brand-gold' : 'hover:bg-white/10 active:bg-white/20'}
                    `}
                    onClick={closeMenu}
                    style={{ touchAction: 'manipulation' }}
                  >
                    Follow Us
                  </NavLink>

                  <div className="h-px bg-white/20 my-2"></div>

                  <button
                    onClick={() => {
                      toggleDarkMode();
                      closeMenu();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors text-white font-medium"
                    style={{ touchAction: 'manipulation' }}
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

      <main className="pt-24 pb-32 lg:pb-8 px-4 max-w-7xl mx-auto overflow-x-hidden" style={{ touchAction: 'pan-y' }}>
        <RouteErrorBoundary>
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
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/my-advertisements" element={<MyAdvertisements />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
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

          <Route
            path="/admin/advertisements"
            element={
              <AdminRoute>
                <AdminAdvertisements />
              </AdminRoute>
            }
          />

          <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </main>

      {/* Share Target Handler */}
      {hasSharedContent && sharedContent && (
        <ShareTargetHandler
          sharedContent={sharedContent}
          onClose={clearSharedContent}
          onSuccess={() => {
            clearSharedContent();
            // Optionally navigate to community page
            window.location.href = '/community';
          }}
        />
      )}

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