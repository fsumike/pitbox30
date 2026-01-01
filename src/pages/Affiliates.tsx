import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Zap, Globe, Users, TrendingUp, BarChart, Share2, ShieldCheck, Award, MessageSquare, DollarSign, LineChart, Gauge, Flag, Star, Settings, ChevronRight, MousePointer, Clock as Click } from 'lucide-react';

function AnimatedStat({ 
  end, 
  suffix = '', 
  duration = 2000,
  className = ''
}: { 
  end: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const steps = 60;
  const stepDuration = duration / steps;

  useEffect(() => {
    let currentStep = 0;
    const increment = end / steps;
    
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [end, stepDuration]);

  return (
    <span className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function Affiliates() {
  const navigate = useNavigate();

  return (
    <div className="space-y-12">
      {/* FTC Disclosure */}
      <div className="glass-panel p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Affiliate Disclosure:</strong> Some links on this page are affiliate and sponsored partnerships.
          This means PIT-BOX may receive compensation when you click on or make purchases through these links.
          This helps support the development of PIT-BOX. Our editorial content is not influenced by these partnerships,
          and we only promote products and services we believe benefit our racing community. For more information, see our{' '}
          <button onClick={() => navigate('/advertiser-terms')} className="underline hover:text-blue-600">
            Advertiser Terms
          </button>.
        </p>
      </div>

      {/* Hero Section with Logo */}
      <div className="carbon-fiber-panel p-8 bg-gradient-to-br from-brand-gold/25 to-brand-gold-dark/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/30 blur-3xl rounded-full scale-110" style={{
                boxShadow: '0 0 80px rgba(251, 191, 36, 0.6), 0 0 140px rgba(245, 158, 11, 0.4)'
              }}></div>
              <img
                src="/android-icon-512-512.png"
                alt="PIT-BOX.COM Logo"
                className="w-full max-w-xl mb-8 drop-shadow-2xl transform hover:scale-105 transition-transform duration-300 relative z-10"
              />
            </div>
            <div className="h-px w-1/2 bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent my-8" />
          </div>

          {/* Feature Boxes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => navigate('/home')}
              className="glass-panel p-6 text-center bg-gradient-to-br from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20 transition-colors group relative"
            >
              <div className="absolute inset-0 rounded-xl border-2 border-brand-gold/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <Settings className="w-12 h-12 text-green-500 mx-auto mb-4 transform group-hover:scale-110 transition-transform" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500/20 rounded-full animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Setup Tools</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Professional-grade setup management tools for optimal performance
              </p>
              <div className="flex items-center justify-center gap-1 mt-3 text-brand-gold font-medium">
                <Click className="w-4 h-4" />
                <span>Click to explore</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate('/community')}
              className="glass-panel p-6 text-center bg-gradient-to-br from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 transition-colors group relative"
            >
              <div className="absolute inset-0 rounded-xl border-2 border-brand-gold/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4 transform group-hover:scale-110 transition-transform" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500/20 rounded-full animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Community</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect with fellow racers and share your racing journey
              </p>
              <div className="flex items-center justify-center gap-1 mt-3 text-brand-gold font-medium">
                <Click className="w-4 h-4" />
                <span>Click to join</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate('/swap-meet')}
              className="glass-panel p-6 text-center bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 transition-colors group relative"
            >
              <div className="absolute inset-0 rounded-xl border-2 border-brand-gold/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <Share2 className="w-12 h-12 text-orange-500 mx-auto mb-4 transform group-hover:scale-110 transition-transform" />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500/20 rounded-full animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Swap Meet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Buy, sell, and trade racing equipment with verified members
              </p>
              <div className="flex items-center justify-center gap-1 mt-3 text-brand-gold font-medium">
                <Click className="w-4 h-4" />
                <span>Click to explore</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
              Partner With The Future of Racing
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Join the revolution that's transforming motorsports. PIT-BOX.COM isn't just another racing app - 
              it's the digital evolution that's setting new standards in professional racing. Don't miss your 
              opportunity to be part of this groundbreaking movement.
            </p>
            <button 
              onClick={() => navigate('/partner-with-us')}
              className="btn-primary text-lg font-semibold"
            >
              Become a Partner
            </button>
          </div>
        </div>
      </div>

      {/* Why Partner With Us */}
      <div className="carbon-fiber-panel p-8">
        <h2 className="text-3xl font-bold text-center mb-12">Why Partner With PIT-BOX.COM?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-brand-gold" />
              </div>
            </div>
            <h3 className="text-xl font-bold">Industry Leadership</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Position your brand alongside the most innovative racing technology platform of 2025. 
              We're not following trends - we're setting them.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <Target className="w-8 h-8 text-brand-gold" />
              </div>
            </div>
            <h3 className="text-xl font-bold">Targeted Exposure</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with a highly engaged audience of professional racers, teams, and enthusiasts 
              who are serious about their sport and equipment.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-brand-gold" />
              </div>
            </div>
            <h3 className="text-xl font-bold">Explosive Growth</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Be part of the fastest-growing racing technology platform. Our user base is expanding 
              rapidly across all racing categories.
            </p>
          </div>
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 bg-white/80 dark:bg-gray-800/50">
          <h2 className="text-2xl font-bold mb-6">Premium Benefits</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Globe className="w-6 h-6 text-brand-gold" />
              <span>Global brand visibility</span>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-brand-gold" />
              <span>Direct access to racing professionals</span>
            </div>
            <div className="flex items-center gap-4">
              <TrendingUp className="w-6 h-6 text-brand-gold" />
              <span>Priority placement in app features</span>
            </div>
            <div className="flex items-center gap-4">
              <BarChart className="w-6 h-6 text-brand-gold" />
              <span>Detailed partnership analytics</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 bg-white/80 dark:bg-gray-800/50">
          <h2 className="text-2xl font-bold mb-6">Exclusive Features</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Share2 className="w-6 h-6 text-brand-gold" />
              <span>Custom integration opportunities</span>
            </div>
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-brand-gold" />
              <span>Verified partner status</span>
            </div>
            <div className="flex items-center gap-4">
              <Award className="w-6 h-6 text-brand-gold" />
              <span>Featured sponsor highlights</span>
            </div>
            <div className="flex items-center gap-4">
              <MessageSquare className="w-6 h-6 text-brand-gold" />
              <span>Direct user engagement channels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsored Affiliates */}
      <div className="glass-panel p-8 bg-white/80 dark:bg-gray-800/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
            Our Sponsored Affiliates
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Proud to partner with the best in racing
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Silver Dollar Speedway */}
          <a
            href="https://www.silverdollarspeedway.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden bg-white/80 dark:bg-gray-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-gold-light/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-end mb-4">
                <div className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold">
                  SPONSORED
                </div>
              </div>

              <div className="mb-4 h-32 flex items-center justify-center bg-gray-900 rounded-lg p-4">
                <img
                  src="https://cdn.myracepass.com/v1/siteresources/35514/v1/img/logo.png"
                  alt="Silver Dollar Speedway"
                  className="w-full h-auto object-contain max-h-24"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Target className="w-4 h-4" />
                <span>Chico, California</span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                Home of the legendary Gold Cup Race of Champions and exciting sprint car racing.
                One of California's premier dirt racing facilities featuring winged 360 sprint cars and hobby stocks.
              </p>

              <div className="flex items-center gap-2 text-brand-gold font-semibold group-hover:gap-3 transition-all">
                <span>Visit Speedway</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </a>

          {/* Thunderbowl Raceway */}
          <a
            href="https://www.thunderbowlraceway.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden bg-white/80 dark:bg-gray-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-gold-light/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-end mb-4">
                <div className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold">
                  SPONSORED
                </div>
              </div>

              <div className="mb-4 h-32 flex items-center justify-center bg-gray-900 rounded-lg p-4">
                <img
                  src="https://www.thunderbowlraceway.com/wp-content/uploads/2020/01/Logo.png"
                  alt="Thunderbowl Raceway"
                  className="w-full h-auto object-contain max-h-24"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Target className="w-4 h-4" />
                <span>Tulare, California</span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                Home of exciting sprint car racing featuring NARC 410 Sprint Cars and the annual Trophy Cup.
                One of California's premier dirt racing venues.
              </p>

              <div className="flex items-center gap-2 text-brand-gold font-semibold group-hover:gap-3 transition-all">
                <span>Visit Raceway</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </a>

          {/* Marysville Raceway */}
          <a
            href="https://www.marysvilleraceway.com"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel p-6 hover:shadow-xl transition-all duration-300 group relative overflow-hidden bg-white/80 dark:bg-gray-800/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-gold-light/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-end mb-4">
                <div className="px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold text-xs font-semibold">
                  SPONSORED
                </div>
              </div>

              <div className="mb-4 h-32 flex items-center justify-center bg-gray-900 rounded-lg p-4">
                <img
                  src="https://cdn.myracepass.com/v1/siteresources/58778/v1/img/logo.png"
                  alt="Marysville Raceway"
                  className="w-full h-auto object-contain max-h-24"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Target className="w-4 h-4" />
                <span>Marysville, California</span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                Partnered with Silver Dollar Speedway, featuring modified, dwarf, winged and wingless sprints.
                Home of the Paul Hawes Memorial Sprint Spooktacular and exciting weekly racing action.
              </p>

              <div className="flex items-center gap-2 text-brand-gold font-semibold group-hover:gap-3 transition-all">
                <span>Visit Raceway</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Call to Action */}
      <div className="carbon-fiber-panel p-8 bg-gradient-to-br from-brand-gold/25 to-brand-gold-dark/20 text-center">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-amber-400/40 blur-2xl rounded-full scale-110" style={{
              boxShadow: '0 0 60px rgba(251, 191, 36, 0.6), 0 0 100px rgba(245, 158, 11, 0.4)'
            }}></div>
            <img
              src="/android-icon-192-192.png"
              alt="PIT-BOX.COM Logo"
              className="w-56 h-auto drop-shadow-xl relative z-10"
            />
          </div>
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Racing Together?</h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Don't miss your opportunity to be part of racing's digital revolution. Join PIT-BOX.COM and help
            shape the future of motorsports technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/partner-with-us')}
              className="btn-primary text-lg font-semibold"
            >
              Partner With Us
            </button>
            <button
              onClick={() => navigate('/partner-with-us')}
              className="btn-secondary text-lg font-semibold"
            >
              Request Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Affiliates;