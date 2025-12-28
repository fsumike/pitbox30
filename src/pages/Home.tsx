import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, Database, Trophy, Share2, ChevronDown, ChevronRight, Car, Zap, Target, Clock, Cloud, Users, LineChart, Lock, Globe, Award, Heart, Gauge, PenTool as Tools, Wrench, Cog, MousePointer, Clock as Click, Flag, ExternalLink } from 'lucide-react';
import SignInButton from '../components/SignInButton';
import SignInPrompt from '../components/SignInPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import SocialPromoBanner from '../components/SocialPromoBanner';
import GeoSponsors from '../components/GeoSponsors';
import { vehicleCategories } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import SubscriptionGate from '../components/SubscriptionGate';

const categoryImages: Record<string, string> = {
  'Sprint Cars': '/495479702_1321020539654208_5408440298677452810_n.jpg',
  'Midget Cars': '/69298c4cd988988b07f26b2b_jja_6613-min copy.jpg',
  'Modifieds': '/imca_southern_sportmod copy.jpg',
  'Late Models': '/erb copy copy.jpeg',
  'Stock Cars': '/392307_articlesection_xl_d10ca69f-828b-441c-9ca4-ab7730ded7ee.png',
  'Youth Racing / Kart': '/photo-3.jpg',
};

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showVehicles, setShowVehicles] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVehicleClick = async (path: string) => {
    setLoading(true);
    try {
      await navigate(path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {loading && <LoadingSpinner fullScreen message="Loading..." />}

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0">
          <img
            src="/073020_scs_worldofoutlaws4wide_bytrentgower.jpg"
            alt="World of Outlaws 4-Wide Racing"
            className="w-full h-full object-cover brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/70 via-brand-black/50 to-brand-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent" />
        </div>
        <div className="relative px-6 py-16 sm:px-12 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <img
                  src="/android-icon-512-512.png"
                  alt="PIT-BOX.COM Logo"
                  width="288"
                  height="288"
                  className="w-64 h-64 md:w-72 md:h-72 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                  The Future of Racing is Here
                </h1>
                <p className="text-xl leading-8 text-gray-300 mb-8">
                  Experience the most advanced setup management platform in motorsports history.
                  PIT-BOX.COM revolutionizes how champions prepare, compete, and win.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {!user && (
                    <button
                      onClick={() => navigate('/signin')}
                      className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
                    >
                      <Lock className="w-5 h-5" />
                      Get Started Free
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/tools')}
                    className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 text-lg font-medium"
                  >
                    <Tools className="w-5 h-5" />
                    Explore Tools
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Section - 2025 Motorsport Design */}
      <div className="p-8 transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden rounded-2xl group">
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(145deg, #00f0ff, #00a8ff, #0066ff, #00f0ff)',
            backgroundSize: '200% 200%',
            padding: '3px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        ></div>

        {/* Realistic Carbon Fiber Base */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            repeating-linear-gradient(0deg, #0a0a0a 0px, #121212 1px, #0a0a0a 2px),
            repeating-linear-gradient(90deg, #0a0a0a 0px, #0f0f0f 1px, #0a0a0a 2px)
          `,
          backgroundSize: '3px 3px',
          opacity: 0.85
        }}></div>

        {/* Neon Racing Stripe Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
          style={{
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 40px rgba(0, 240, 255, 0.4)',
          }}
        ></div>

        {/* Holographic Tech Overlay */}
        <div className="absolute inset-0 rounded-2xl opacity-40" style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(255, 100, 0, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, rgba(0, 240, 255, 0.05) 0%, transparent 30%, rgba(0, 168, 255, 0.08) 70%, transparent 100%)
          `
        }}></div>

        {/* Animated Tech Lines */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.3) 50%, transparent 100%)
          `,
          backgroundSize: '200px 100%',
          animation: 'shimmer 3s infinite linear',
        }}></div>

        {/* Hex Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2300f0ff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Glossy Inner Surface */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900/95 via-black/90 to-gray-950/95"></div>

        {/* Corner Tech Details */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-cyan-400/50" style={{
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
        }}></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-cyan-400/50" style={{
          boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)'
        }}></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-orange-500/50" style={{
          boxShadow: '0 0 10px rgba(255, 100, 0, 0.3)'
        }}></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-orange-500/50" style={{
          boxShadow: '0 0 10px rgba(255, 100, 0, 0.3)'
        }}></div>

        <div className="relative z-10">
        <div className="text-center mb-8">
          {/* Neon Glow Title */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative inline-block">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent" style={{
              textShadow: '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(0, 240, 255, 0.3)',
              filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))'
            }}>
              Master Your Racing Machine
            </span>
          </h2>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Welcome to the heart of <span className="text-cyan-400 font-semibold">PIT-BOX.COM</span> - your comprehensive setup management system.
            Our professional-grade tools are designed to help you achieve peak performance
            and maintain your competitive edge. Select your vehicle class below to access
            detailed setup sheets, track changes, and optimize your racing machine for victory.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {/* Main Select Vehicle Button - Motorsport Style */}
          <motion.button
            className="w-full p-6 cursor-pointer transition-all duration-500 relative group rounded-xl overflow-hidden"
            onClick={() => setShowVehicles(!showVehicles)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            style={{
              background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(0, 240, 255, 0.1)',
            }}
          >
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.4), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            ></div>

            {/* Neon accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Tools className="w-8 h-8 text-cyan-400" style={{
                    filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))'
                  }} />
                  <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Racing Setup Headquarters
                </span>
              </div>
              <ChevronDown
                className={`w-6 h-6 text-cyan-400 transition-all duration-300 ${
                  showVehicles ? 'rotate-180' : ''
                }`}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(0, 240, 255, 0.4))'
                }}
              />
            </div>
            <p className="text-gray-300 text-left mt-2 pl-12 relative z-10">
              Unlock championship-caliber performance with our professional setup tools
            </p>
            <div className="flex items-center gap-2 mt-3 text-cyan-400 font-medium pl-12 relative z-10">
              <Click className="w-5 h-5" />
              <span>Click to access your racing vehicle setup tools</span>
              <ChevronRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
            </div>
          </motion.button>

          {/* Vehicle Categories */}
          {showVehicles && (
            <SubscriptionGate>
              <div className="space-y-4 transition-all duration-500 opacity-100 max-h-[2000px] mb-48">
                {vehicleCategories.Vehicles.map((category) => (
                  <div key={category.name} className="pl-4">
                    <button
                      className="w-full glass-panel cursor-pointer transition-all duration-300 overflow-hidden relative group"
                      onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                    >
                      {categoryImages[category.name] && (
                        <div className="absolute inset-0">
                          <img
                            src={categoryImages[category.name]}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/30 transition-all" />
                        </div>
                      )}
                      <div className="relative p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Car className="w-6 h-6 text-brand-gold" />
                          <span className="text-xl font-semibold text-white drop-shadow-lg">Setup Tools: {category.name}</span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-white transition-transform duration-300 ${
                            activeCategory === category.name ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Subcategories */}
                    <div className={`grid gap-3 pl-4 mt-3 transition-all duration-300 ${
                      activeCategory === category.name 
                        ? 'opacity-100 max-h-[1000px]' 
                        : 'opacity-0 max-h-0 overflow-hidden'
                    }`}>
                      {category.subcategories.map((subItem) => (
                        <button
                          key={subItem.path}
                          onClick={() => handleVehicleClick(subItem.path)}
                          className="glass-panel p-4 text-left group hover:bg-brand-gold/5 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Settings className="w-5 h-5 text-brand-gold" />
                              <div>
                                <span className="text-lg font-medium">{subItem.name}</span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Access setup sheets and optimization tools
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SubscriptionGate>
          )}

          {/* Call to Action */}
          <div className="text-center mt-12 mb-16">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started now with our professional setup management tools
            </p>
            {!user && (
              <button
                onClick={() => navigate('/signin')}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Lock className="w-5 h-5" />
                Sign In to Access Setup Tools
              </button>
            )}
            {user && !showVehicles && (
              <button
                onClick={() => setShowVehicles(true)}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Settings className="w-5 h-5" />
                View Setup Tools
              </button>
            )}
            {user && showVehicles && (
              <button
                onClick={() => navigate('/subscription')}
                className="bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/40 text-gray-900 dark:text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center gap-2 mx-auto mb-8 font-medium shadow-lg"
              >
                <Shield className="w-5 h-5" />
                View Subscription Plans
              </button>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="glass-panel p-8 mt-12 mb-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Champions Choose PIT-BOX.COM</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Clock className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Real-Time Excellence</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Make split-second decisions with confidence. Update and analyze setups instantly during race day.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Cloud className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Universal Access</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your entire racing history at your fingertips, accessible anywhere in the world.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Team Synergy</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seamless collaboration between crew members, engineers, and drivers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <LineChart className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Performance Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Advanced data analysis reveals winning patterns and optimization opportunities.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Lock className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Secure Innovation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your proprietary setups are protected with bank-level security protocols.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Globe className="w-8 h-8 text-brand-gold" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Pit Community</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join an elite network of racing professionals and champions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Geo-Targeted Sponsored Affiliates */}
      <GeoSponsors maxSponsors={3} showDistance={true} />

      {/* Thank You Section */}
      <div className="glass-panel p-8 bg-gradient-to-br from-brand-gold/10 via-brand-gold/5 to-brand-gold/10 mb-24">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-16 h-16 text-brand-gold mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
            With Gratitude
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            PIT-BOX.COM would not be possible without the incredible support and dedication of many amazing people.
            A special heartfelt thank you to my beautiful wife, whose unwavering support, patience, and understanding
            has been the cornerstone of this journey. Her sacrifices of time and endless encouragement have made
            this dream a reality.
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            To our early adopters, development team, and racing community - your trust and feedback
            have been invaluable in shaping PIT-BOX.COM into the revolutionary platform it is today.
            Together, we're changing the future of racing.
          </p>
        </div>
      </div>

      {/* Social Media Promotional Banner */}
      <SocialPromoBanner variant="inline" dismissible={true} />

      {/* Extra spacing for mobile to prevent overlap */}
      <div className="h-16 md:h-0"></div>

      {/* Sign In Prompt Modal */}
      <SignInPrompt 
        isOpen={showSignInPrompt}
        onClose={() => setShowSignInPrompt(false)}
        onSignIn={() => {
          setShowSignInPrompt(false);
          document.querySelector<HTMLButtonElement>('.sign-in-trigger')?.click();
        }}
      />

      {/* Hidden sign-in trigger */}
      <SignInButton className="hidden sign-in-trigger" />
    </div>
  );
}

export default Home;