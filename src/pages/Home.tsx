import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Shield, ChevronDown, ChevronRight, Lock, Heart, PenTool as Tools, Clock as Click } from 'lucide-react';
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
    <div className="space-y-12 relative">
      {/* Dark Carbon Fiber Background - Light Mode uses dark theme, Dark Mode goes even darker */}
      <div className="fixed inset-0 -z-10 dark:hidden" style={{
        background: `
          repeating-linear-gradient(45deg, #1A1A1A 0px, #151515 1px, #1A1A1A 2px, #121212 3px),
          repeating-linear-gradient(-45deg, #1A1A1A 0px, #181818 1px, #1A1A1A 2px, #131313 3px)
        `,
        backgroundSize: '8px 8px',
      }}></div>

      {/* Even Darker Carbon Fiber Background for Dark Mode */}
      <div className="fixed inset-0 -z-10 hidden dark:block" style={{
        background: `
          repeating-linear-gradient(45deg, #000000 0px, #050505 1px, #000000 2px, #030303 3px),
          repeating-linear-gradient(-45deg, #000000 0px, #020202 1px, #000000 2px, #010101 3px)
        `,
        backgroundSize: '8px 8px',
      }}></div>

      {/* Carbon Fiber Diagonal Weave Overlay */}
      <div className="fixed inset-0 -z-10 dark:opacity-100 opacity-100" style={{
        background: `
          repeating-linear-gradient(45deg, transparent 0px, transparent 3px, rgba(255, 255, 255, 0.03) 3px, rgba(255, 255, 255, 0.03) 6px),
          repeating-linear-gradient(-45deg, transparent 0px, transparent 3px, rgba(255, 255, 255, 0.04) 3px, rgba(255, 255, 255, 0.04) 6px)
        `,
        backgroundSize: '12px 12px',
      }}></div>

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
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-6 md:gap-10">
              <div className="flex-shrink-0">
                <img
                  src="/android-icon-512-512.png"
                  alt="PIT-BOX.COM Logo"
                  width="256"
                  height="256"
                  className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 leading-tight">
                  Save, Track & Perfect Your Racing Setups
                </h1>
                <p className="text-lg sm:text-xl leading-relaxed text-gray-300 mb-8">
                  Your complete racing setup database. Store unlimited setups, track changes across every race,
                  and access your data anywhere. Built by racers, for racers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  {!user && (
                    <button
                      onClick={() => navigate('/signin')}
                      className="btn-primary text-lg px-8 py-3 w-full sm:w-auto justify-center"
                    >
                      Get Started Free
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/tools')}
                    className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-lg hover:bg-white/20 transition-all text-lg font-medium w-full sm:w-auto"
                  >
                    Explore Tools
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Section - Dirt Racing Inspired */}
      <div className="p-8 transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden rounded-2xl group">
        {/* Lighter Base Layer for Visible Carbon */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1410] via-[#1c1612] to-[#181410]"></div>

        {/* Enhanced Visible Carbon Fiber Texture */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            repeating-linear-gradient(0deg, #3a2d1a 0px, #261d10 1px, #3a2d1a 2px, #2e2414 3px),
            repeating-linear-gradient(90deg, #3a2d1a 0px, #2a1f12 1px, #3a2d1a 2px, #322618 3px)
          `,
          backgroundSize: '6px 6px',
          opacity: 0.95,
        }}></div>

        {/* Carbon Fiber Weave Highlights */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            repeating-linear-gradient(45deg, transparent 0px, transparent 2px, rgba(251, 191, 36, 0.08) 2px, rgba(251, 191, 36, 0.08) 4px),
            repeating-linear-gradient(-45deg, transparent 0px, transparent 2px, rgba(217, 119, 6, 0.06) 2px, rgba(217, 119, 6, 0.06) 4px)
          `,
          backgroundSize: '8px 8px',
          opacity: 0.4,
        }}></div>

        {/* White Carbon Fiber Pattern - Angled and Visible */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.05) 0px,
              rgba(255, 255, 255, 0.05) 3px,
              transparent 3px,
              transparent 6px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.05) 0px,
              rgba(255, 255, 255, 0.05) 3px,
              transparent 3px,
              transparent 6px
            ),
            radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)
          `,
          backgroundSize: '6px 6px, 6px 6px, 100% 100%',
        }}></div>

        {/* Glossy Carbon Shine Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-20" style={{
          background: `linear-gradient(135deg,
            transparent 0%,
            rgba(251, 191, 36, 0.15) 30%,
            transparent 50%,
            rgba(245, 158, 11, 0.1) 70%,
            transparent 100%
          )`,
        }}></div>

        {/* Dirt/Clay Texture Overlay - Reduced */}
        <div className="absolute inset-0 rounded-2xl opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5' /%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay'
        }}></div>

        {/* Golden Racing Stripe - Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          style={{
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(245, 158, 11, 0.5)',
          }}
        ></div>

        {/* Glowing Gold Border on Hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(145deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
            backgroundSize: '200% 200%',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'shimmer 3s infinite linear',
          }}
        ></div>

        {/* Dirt Spray Gradient */}
        <div className="absolute inset-0 rounded-2xl opacity-30" style={{
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(234, 88, 12, 0.12) 0%, transparent 50%),
            linear-gradient(135deg, rgba(251, 191, 36, 0.05) 0%, transparent 40%, rgba(217, 119, 6, 0.08) 80%, transparent 100%)
          `
        }}></div>

        {/* Roost Kick - Animated Dust */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.2) 50%, transparent 100%)
          `,
          backgroundSize: '200px 100%',
          animation: 'shimmer 4s infinite linear',
        }}></div>

        {/* White Carbon Fiber Pattern - Angled and Visible */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.05) 0px,
              rgba(255, 255, 255, 0.05) 3px,
              transparent 3px,
              transparent 6px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.05) 0px,
              rgba(255, 255, 255, 0.05) 3px,
              transparent 3px,
              transparent 6px
            ),
            radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)
          `,
          backgroundSize: '6px 6px, 6px 6px, 100% 100%',
        }}></div>

        {/* Subtle Red Racing Accent - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>

        <div className="relative z-10">
        <div className="text-center mb-8 px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent" style={{
              textShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)',
              filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))'
            }}>
              Master Your Racing Machine
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Welcome to the heart of <span className="text-amber-400 font-semibold" style={{
              textShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
            }}>PIT-BOX.COM</span> - your comprehensive setup management system.
            Our professional-grade tools are designed to help you achieve peak performance
            and maintain your competitive edge. Select your vehicle class below to access
            detailed setup sheets, track changes, and optimize your racing machine for victory.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4 px-4">
          {/* Main Select Vehicle Button - Dirt Racing Style */}
          <motion.button
            className="w-full p-5 sm:p-6 cursor-pointer transition-all duration-500 relative group rounded-xl overflow-hidden"
            onClick={() => setShowVehicles(!showVehicles)}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            style={{
              background: 'linear-gradient(135deg, rgba(10, 6, 4, 0.95) 0%, rgba(18, 10, 6, 0.98) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(251, 191, 36, 0.15)',
            }}
          >
            {/* Animated gold border glow */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s linear infinite',
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            ></div>

            {/* Gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"></div>

            {/* Dirt texture overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' /%3E%3C/svg%3E")`,
            }}></div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative hidden sm:block">
                  <Tools className="w-7 h-7 sm:w-8 sm:h-8 text-amber-400" style={{
                    filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.7))'
                  }} />
                  <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full"></div>
                </div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent">
                  Racing Setup Headquarters
                </span>
              </div>
              <ChevronDown
                className={`w-6 h-6 text-amber-400 transition-all duration-300 flex-shrink-0 ${
                  showVehicles ? 'rotate-180' : ''
                }`}
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(251, 191, 36, 0.5))'
                }}
              />
            </div>
            <p className="text-gray-300 text-left mt-2 sm:pl-12 relative z-10 text-sm sm:text-base">
              Unlock championship-caliber performance with our professional setup tools
            </p>
            <div className="flex items-center gap-2 mt-3 text-amber-400 font-medium sm:pl-12 relative z-10 text-sm sm:text-base">
              <Click className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>Click to access your racing vehicle setup tools</span>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform flex-shrink-0" />
            </div>
          </motion.button>

          {/* Vehicle Categories */}
          {showVehicles && (
            <SubscriptionGate>
              <div className="space-y-4 transition-all duration-500 opacity-100 max-h-[2000px] mb-48">
                {vehicleCategories.Vehicles.map((category) => (
                  <div key={category.name} className="pl-2 sm:pl-4">
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
                      <div className="relative p-4 sm:p-6 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-lg sm:text-xl font-semibold text-white drop-shadow-lg">Setup Tools: {category.name}</span>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-white transition-transform duration-300 flex-shrink-0 ${
                            activeCategory === category.name ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </button>

                    {/* Subcategories */}
                    <div className={`grid gap-3 pl-2 sm:pl-4 mt-3 transition-all duration-300 ${
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
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <span className="text-base sm:text-lg font-medium block">{subItem.name}</span>
                              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Access setup sheets and optimization tools
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
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
          <div className="text-center mt-12 mb-16 px-4">
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              Get started now with our professional setup management tools
            </p>
            {!user && (
              <button
                onClick={() => navigate('/signin')}
                className="btn-primary mx-auto w-full sm:w-auto px-8 py-3"
              >
                Sign In to Access Setup Tools
              </button>
            )}
            {user && !showVehicles && (
              <button
                onClick={() => setShowVehicles(true)}
                className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 py-3 rounded-lg hover:bg-white/20 transition-all mx-auto w-full sm:w-auto font-medium"
              >
                View Setup Tools
              </button>
            )}
            {user && showVehicles && (
              <button
                onClick={() => navigate('/subscription')}
                className="bg-white/30 backdrop-blur-md border border-white/40 hover:bg-white/40 text-gray-900 dark:text-white px-8 py-3 rounded-lg transition-all duration-300 mx-auto mb-8 font-medium shadow-lg w-full sm:w-auto"
              >
                View Subscription Plans
              </button>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Geo-Targeted Sponsored Affiliates */}
      <GeoSponsors maxSponsors={3} showDistance={true} />

      {/* Thank You Section - Carbon Fiber Style */}
      <div className="p-8 mb-24 transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden rounded-2xl group">
        {/* Lighter Base Layer for Visible Carbon */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1410] via-[#1c1612] to-[#181410]"></div>

        {/* Enhanced Visible Carbon Fiber Texture */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            repeating-linear-gradient(0deg, #3a2d1a 0px, #261d10 1px, #3a2d1a 2px, #2e2414 3px),
            repeating-linear-gradient(90deg, #3a2d1a 0px, #2a1f12 1px, #3a2d1a 2px, #322618 3px)
          `,
          backgroundSize: '6px 6px',
          opacity: 0.95,
        }}></div>

        {/* Carbon Fiber Weave Highlights */}
        <div className="absolute inset-0 rounded-2xl" style={{
          background: `
            repeating-linear-gradient(45deg, transparent 0px, transparent 2px, rgba(251, 191, 36, 0.08) 2px, rgba(251, 191, 36, 0.08) 4px),
            repeating-linear-gradient(-45deg, transparent 0px, transparent 2px, rgba(217, 119, 6, 0.06) 2px, rgba(217, 119, 6, 0.06) 4px)
          `,
          backgroundSize: '8px 8px',
          opacity: 0.4,
        }}></div>

        {/* White Carbon Fiber Pattern - Angled and Visible */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.05) 0px,
              rgba(255, 255, 255, 0.05) 3px,
              transparent 3px,
              transparent 6px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.05) 0px,
              rgba(255, 255, 255, 0.05) 3px,
              transparent 3px,
              transparent 6px
            ),
            radial-gradient(ellipse at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)
          `,
          backgroundSize: '6px 6px, 6px 6px, 100% 100%',
        }}></div>

        {/* Glossy Carbon Shine Effect */}
        <div className="absolute inset-0 rounded-2xl opacity-20" style={{
          background: `linear-gradient(135deg,
            transparent 0%,
            rgba(251, 191, 36, 0.15) 30%,
            transparent 50%,
            rgba(245, 158, 11, 0.1) 70%,
            transparent 100%
          )`,
        }}></div>

        {/* Golden Racing Stripe - Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          style={{
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(245, 158, 11, 0.5)',
          }}
        ></div>

        {/* Glowing Gold Border on Hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(145deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
            backgroundSize: '200% 200%',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            animation: 'shimmer 3s infinite linear',
          }}
        ></div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Heart className="w-16 h-16 text-amber-400 mx-auto mb-6 animate-pulse" style={{
            filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))'
          }} />
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-300 bg-clip-text text-transparent" style={{
            textShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(245, 158, 11, 0.4)',
            filter: 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.8))'
          }}>
            With Gratitude
          </h2>
          <p className="text-xl text-gray-200 leading-relaxed mb-8 drop-shadow-lg">
            PIT-BOX.COM would not be possible without the incredible support and dedication of many amazing people.
            A special heartfelt thank you to my beautiful wife, whose unwavering support, patience, and understanding
            has been the cornerstone of this journey. Her sacrifices of time and endless encouragement have made
            this dream a reality.
          </p>
          <p className="text-lg text-gray-300 drop-shadow-lg">
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