import React, { useState, useEffect, useRef } from 'react';
import { LogIn, X, Loader2, User, LogOut, ChevronDown, Info, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useRetry } from '../hooks/useRetry';

interface SignInButtonProps {
  className?: string;
}

function SignInButton({ className }: SignInButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoValid, setPromoValid] = useState<boolean | null>(null);
  const [promoUsed, setPromoUsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { signIn, signUp, user, signOut, connectionError, retryConnection } = useAuth();
  const { executeWithRetry } = useRetry();

  // Valid promo codes list
  const validPromoCodes = [
    'Silva57', 'Daniels5', 'Larson57', 'Colby5', 'Andy92', 'Brad49', 'Kyle54', 'Kaleb3',
    'Slingin18', 'Claygrip33', 'Highline22', 'Dirtdog77', 'Slidejob04', 'Cushion55',
    'Roostertail81', 'Gasit49', 'Sprintcar92', 'Latemodel68', 'Bullring11', 'Checkered99',
    'Fullthrottle07', 'Redclay36', 'Wheelie29', 'Chassis14', 'Featurewin63', 'Trackside70',
    'Pitside88', 'Glorylaps44', 'Pitboxmike', 'Chaz44', 'Chaz33', 'Chaz22', 'Chaz55', 'Chaz11'
  ];

  // Load profile data for the user menu
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      checkTermsAcceptance();
    } else {
      setProfile(null); // Reset profile when user logs out
      setProfileError(null);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setProfileError(null);

      const result = await executeWithRetry(async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (!data) {
            const { error: createError } = await supabase
              .from('profiles')
              .insert([{
                id: user.id,
                username: user.email?.split('@')[0] || user.email,
                full_name: user.user_metadata?.full_name || null,
                avatar_url: user.user_metadata?.avatar_url || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);

            if (createError) throw createError;

            const { data: newProfile, error: loadError } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', user.id)
              .maybeSingle();

            if (loadError) throw loadError;
            return newProfile;
          }

          return data;
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
          }
          if (err instanceof TypeError && err.message === 'Failed to fetch') {
            throw new Error('Network connection failed. Please check your internet connection.');
          }
          throw err;
        }
      });

      if (result) {
        setProfile(result);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setProfileError('Unable to load profile. Please check your connection.');
    }
  };

  const checkTermsAcceptance = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('terms_acceptance')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking terms acceptance:', error);
      }

      setHasAcceptedTerms(!!data);
    } catch (err) {
      console.error('Error checking terms acceptance:', err);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDropdown(false);
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Handle scroll lock when dropdown is open on mobile
  useEffect(() => {
    if (showDropdown && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showDropdown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Check if promo code is valid
  const checkPromoCode = (code: string) => {
    if (!code) {
      setPromoValid(null);
      setPromoUsed(false);
      return false;
    }
    
    // Normalize the code: lowercase everything, then capitalize first letter
    const normalizedCode = code.toLowerCase();
    const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);
    
    const isValid = validPromoCodes.includes(capitalizedCode);
    setPromoValid(isValid);
    
    if (isValid) {
      // Check if the promo code has already been used
      checkPromoCodeUsed(capitalizedCode);
    }
    
    return isValid;
  };
  
  // Check if promo code has already been used
  const checkPromoCodeUsed = async (code: string) => {
    try {
      const { data, error } = await executeWithRetry(async () => {
        return await supabase
          .from('profiles')
          .select('id')
          .eq('promo_code', code)
          .limit(1);
      });
        
      if (error) throw error;
      
      const isUsed = data && data.length > 0;
      setPromoUsed(isUsed);
      
      if (isUsed) {
        setPromoValid(false);
      }
      
      return isUsed;
    } catch (err) {
      console.error('Error checking if promo code is used:', err);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignIn) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password');
          } else {
            setError(error.message);
          }
        } else {
          setShowModal(false);
          setEmail('');
          setPassword('');
          navigate('/home');
        }
      } else {
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }

        // Check if promo code is valid and not used
        if (promoCode) {
          const normalizedCode = promoCode.toLowerCase();
          const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);
          
          const isValid = validatePromoCode(capitalizedCode);
          if (!isValid) {
            setError('Invalid promo code');
            setLoading(false);
            return;
          }
          
          const isUsed = await checkPromoCodeUsed(capitalizedCode);
          if (isUsed) {
            setError('This promo code has already been used');
            setLoading(false);
            return;
          }
        }

        // Sign up the user
        const { error, success } = await signUp(email, password);
        if (error) {
          if (error.message.includes('user_already_exists')) {
            setError('An account with this email already exists. Please sign in instead.');
            setIsSignIn(true);
          } else {
            setError(error.message);
          }
        } else if (success) {
          // After successful signup, create/update profile
          const { data: { user: newUser } } = await supabase.auth.getUser();
          
          if (newUser) {
            // Normalize the promo code if provided
            let normalizedPromoCode = null;
            if (promoCode && validatePromoCode(promoCode)) {
              const code = promoCode.toLowerCase();
              normalizedPromoCode = code.charAt(0).toUpperCase() + code.slice(1);
            }
            
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: newUser.id,
                username: username.trim(),
                full_name: fullName.trim() || null,
                promo_code: normalizedPromoCode,
                has_premium: !!normalizedPromoCode,
                updated_at: new Date().toISOString()
              });

            if (profileError) {
              console.error('Error creating profile:', profileError);
            }
          }

          setShowModal(false);
          setEmail('');
          setPassword('');
          setUsername('');
          setFullName('');
          setPromoCode('');
          navigate('/terms-of-service');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
      setProfile(null);
      setEmail('');
      setPassword('');
      setUsername('');
      setFullName('');
      setPromoCode('');
      setError(null);

      // Delay navigation to ensure session is cleared
      setTimeout(() => navigate('/', { replace: true }), 300);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Error signing out. Please try again.');
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  const handleRetryProfile = () => {
    loadProfile();
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);
    checkPromoCode(code);
  };
  
  // Validate a promo code
  const validatePromoCode = (code: string): boolean => {
    if (!code) return false;
    
    // Normalize the code: lowercase everything, then capitalize first letter
    const normalizedCode = code.toLowerCase();
    const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);
    
    return validPromoCodes.includes(capitalizedCode);
  };

  const handleRetryConnection = async () => {
    await retryConnection();
  };

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center gap-2 relative ${className}`}
          title={profile?.full_name || 'Set up profile'}
        >
          <div className="relative">
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                <User className="w-5 h-5 text-brand-gold" />
              </div>
            )}
          </div>
          <span className="hidden md:inline text-sm font-medium truncate max-w-[150px] text-yellow-500">
            {profileError ? (
              <button
                onClick={handleRetryProfile}
                className="text-red-500 hover:text-red-600"
              >
                Retry loading profile
              </button>
            ) : (
              profile?.full_name || 'Set up profile'
            )}
          </span>
          {/* ORIGINAL (default color): <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} /> */}
          {/* Updated to yellow/gold for better visibility with translucent background */}
          <ChevronDown className={`w-4 h-4 text-brand-gold transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            {/* Mobile overlay */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1099] md:hidden"
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Dropdown content */}
            <div
              className="fixed md:absolute left-0 right-0 md:left-auto md:right-0 md:w-64 top-[4rem] md:top-[calc(100%+0.5rem)] bg-gray-900 border-t md:border border-gray-700 overflow-hidden z-[1100] safe-area-top md:safe-area-top-0 animate-slideIn md:animate-none rounded-none md:rounded-xl shadow-xl h-auto max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-5rem)] overflow-y-auto"
            >
              {/* Menu Items */}
              <div className="divide-y divide-gray-700">
                {/* Connection Error Banner */}
                {connectionError && (
                  <div className="p-4 bg-red-900/20 border-b border-red-800">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-red-300 mb-2">
                          Connection Error: {connectionError}
                        </p>
                        <button
                          onClick={handleRetryConnection}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
                        >
                          <RefreshCw className="w-3 h-3" />
                          Retry Connection
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Name and Email Section */}
                <div className="p-6">
                  <div className="flex-1 min-w-0">
                    {profileError ? (
                      <div className="space-y-2">
                        <p className="text-red-400 text-sm">{profileError}</p>
                        <button
                          onClick={handleRetryProfile}
                          className="text-brand-gold hover:text-amber-400 text-sm"
                        >
                          Retry loading profile
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xl font-semibold text-white truncate">
                          {profile?.full_name || 'Set up profile'}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {user.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Terms of Service */}
                {!hasAcceptedTerms && (
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/terms-of-service');
                    }}
                    className="w-full px-6 py-4 text-left text-red-400 hover:bg-gray-800 flex items-center gap-2"
                  >
                    <Info className="w-5 h-5" />
                    Accept Terms of Service
                  </button>
                )}

                {/* Profile Settings */}
                <button
                  onClick={handleProfileClick}
                  className="w-full px-6 py-4 text-left text-white hover:bg-gray-800"
                >
                  Profile Settings
                </button>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full px-6 py-4 text-left text-red-400 hover:bg-gray-800"
                >
                  Sign Out
                </button>
              </div>

              {/* Safe area spacer for mobile */}
              <div className="h-[env(safe-area-inset-bottom)] md:hidden" />
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => navigate('/signin')}
        className={`flex items-center gap-2 ${className}`}
        title="Sign In"
      >
        <LogIn className="w-5 h-5" />
        <span className="hidden md:inline">Sign In</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md my-auto max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative p-6">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6">
                {isSignIn ? 'Sign In to PitBox' : 'Create PitBox Account'}
              </h2>

              {/* Connection Error Banner */}
              {connectionError && (
                <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                        Connection Error: {connectionError}
                      </p>
                      <button
                        onClick={handleRetryConnection}
                        className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry Connection
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {!isSignIn && (
                  <>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium mb-1">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600"
                        placeholder="Choose a username"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600"
                        placeholder="Your full name"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label htmlFor="promoCode" className="block text-sm font-medium mb-1">
                        Promo Code
                        <span className="ml-1 text-xs text-gray-500">(Optional)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="promoCode"
                          value={promoCode}
                          onChange={handlePromoCodeChange}
                          className={`w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border ${
                            promoValid === true && !promoUsed
                              ? 'border-green-500 dark:border-green-500' 
                              : promoValid === false || promoUsed
                              ? 'border-red-500 dark:border-red-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          placeholder="Enter promo code if you have one"
                          disabled={loading}
                        />
                        {promoValid === true && !promoUsed && (
                          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                      
                      {promoValid === true && !promoUsed && (
                        <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                          Valid promo code! You'll have premium access.
                        </p>
                      )}
                      {promoValid === false && promoCode && !promoUsed && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          Invalid promo code.
                        </p>
                      )}
                      {promoUsed && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          This promo code has already been used.
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600"
                    placeholder="your@email.com"
                    required
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600"
                    placeholder="••••••••"
                    required
                    autoComplete={isSignIn ? "current-password" : "new-password"}
                    disabled={loading}
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isSignIn ? '' : 'Password must be at least 6 characters'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || (promoCode && (promoValid === false || promoUsed)) || !!connectionError}
                  className="w-full bg-brand-gold text-white py-3 px-4 rounded-lg hover:bg-brand-gold-dark transition text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isSignIn ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      {isSignIn ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </button>

                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button
                    type="button"
                    className="text-brand-gold hover:text-brand-gold-dark dark:text-brand-gold-light dark:hover:text-brand-gold"
                    onClick={() => {
                      setIsSignIn(!isSignIn);
                      setError(null);
                      setPromoValid(null);
                      setPromoCode('');
                      setPromoUsed(false);
                    }}
                  >
                    {isSignIn ? 'Create one' : 'Sign in'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignInButton;