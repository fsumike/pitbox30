import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Loader2, CheckCircle, AlertTriangle, RefreshCw, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useRetry } from '../hooks/useRetry';

function SignIn() {
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

  const { signIn, signUp, user, connectionError, retryConnection } = useAuth();
  const { executeWithRetry } = useRetry();

  const validPromoCodes = [
    'Silva57', 'Daniels5', 'Larson57', 'Colby5', 'Andy92', 'Brad49', 'Kyle54', 'Kaleb3',
    'Slingin18', 'Claygrip33', 'Highline22', 'Dirtdog77', 'Slidejob04', 'Cushion55',
    'Roostertail81', 'Gasit49', 'Sprintcar92', 'Latemodel68', 'Bullring11', 'Checkered99',
    'Fullthrottle07', 'Redclay36', 'Wheelie29', 'Chassis14', 'Featurewin63', 'Trackside70',
    'Pitside88', 'Glorylaps44', 'Pitboxmike', 'Chaz44', 'Chaz33', 'Chaz22', 'Chaz55', 'Chaz11'
  ];

  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const checkPromoCode = (code: string) => {
    if (!code) {
      setPromoValid(null);
      setPromoUsed(false);
      return false;
    }

    const normalizedCode = code.toLowerCase();
    const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);

    const isValid = validPromoCodes.includes(capitalizedCode);
    setPromoValid(isValid);

    if (isValid) {
      checkPromoCodeUsed(capitalizedCode);
    }

    return isValid;
  };

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

    const trimmedEmail = email.trim();
    const trimmedPassword = password;

    if (!trimmedEmail) {
      setError('Please enter an email address');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!trimmedPassword || trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      if (isSignIn) {
        const { error } = await signIn(trimmedEmail, trimmedPassword);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password');
          } else {
            setError(error.message);
          }
        } else {
          const from = (location.state as any)?.from?.pathname || '/home';
          navigate(from, { replace: true });
        }
      } else {
        if (!username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }

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

        const trimmedUsername = username.trim();
        const trimmedFullName = fullName.trim();

        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', trimmedUsername)
          .maybeSingle();

        if (existingProfile) {
          setError('This username is already taken. Please choose another.');
          setLoading(false);
          return;
        }

        const { error, success } = await signUp(trimmedEmail, trimmedPassword, {
          username: trimmedUsername,
          full_name: trimmedFullName,
        });

        if (error) {
          if (error.message.includes('user_already_exists') || error.message.includes('already registered')) {
            setError('An account with this email already exists. Please sign in instead.');
            setIsSignIn(true);
          } else {
            setError(error.message);
          }
        } else if (success) {
          let retries = 0;
          let newUser = null;

          while (retries < 3 && !newUser) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const { data } = await supabase.auth.getUser();
            newUser = data?.user;
            retries++;
          }

          if (newUser) {
            let normalizedPromoCode = null;
            if (promoCode && validatePromoCode(promoCode)) {
              const code = promoCode.toLowerCase();
              normalizedPromoCode = code.charAt(0).toUpperCase() + code.slice(1);
            }

            try {
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                  id: newUser.id,
                  username: trimmedUsername,
                  full_name: trimmedFullName || null,
                  promo_code: normalizedPromoCode,
                  has_premium: !!normalizedPromoCode,
                  updated_at: new Date().toISOString()
                }, { onConflict: 'id' });

              if (profileError) {
                console.error('Error creating profile:', profileError);
              }
            } catch (profileErr) {
              console.error('Profile creation error:', profileErr);
            }
          }

          navigate('/terms-of-service', { replace: true });
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPromoCode(code);
    checkPromoCode(code);
  };

  const validatePromoCode = (code: string): boolean => {
    if (!code) return false;

    const normalizedCode = code.toLowerCase();
    const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);

    return validPromoCodes.includes(capitalizedCode);
  };

  const handleRetryConnection = async () => {
    await retryConnection();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <div className="liquid-orb liquid-orb-gold w-48 sm:w-64 md:w-80 h-48 sm:h-64 md:h-80 -top-16 sm:-top-20 md:-top-20 -left-16 sm:-left-20 md:-left-20 fixed z-0 opacity-60" />
      <div className="liquid-orb liquid-orb-amber w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 -bottom-12 sm:-bottom-16 md:-bottom-16 -right-12 sm:-right-16 md:-right-16 fixed z-0 opacity-60" style={{ animationDelay: '-7s' }} />
      <div className="liquid-orb liquid-orb-gold w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 top-1/3 right-2 sm:right-6 md:right-10 fixed z-0 opacity-60" style={{ animationDelay: '-12s' }} />

      <div className="relative w-full max-w-md z-10">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
          <div className="text-center mb-8 relative z-10">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full scale-125" />
              <img
                src="/android-icon-192-192.png"
                alt="PIT-BOX.COM"
                className="w-24 h-24 mx-auto mb-4 relative z-10"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              {isSignIn ? 'Sign In to PitBox' : 'Create PitBox Account'}
            </h1>
            <p className="text-gray-300">
              {isSignIn ? 'Welcome back!' : 'Join the winners circle'}
            </p>
          </div>

          {connectionError && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/30 border border-red-500/50 relative z-10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-red-300 mb-2">
                    Connection Error: {connectionError}
                  </p>
                  <button
                    onClick={handleRetryConnection}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {error && (
              <div className="p-4 rounded-xl bg-red-900/30 border border-red-500/50 text-red-300 text-sm">
                {error}
              </div>
            )}

            {!isSignIn && (
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium mb-1 text-white">
                    Username <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Choose a username"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1 text-white">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Your full name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="promoCode" className="block text-sm font-medium mb-1 text-white">
                    Promo Code
                    <span className="ml-1 text-xs text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="promoCode"
                      value={promoCode}
                      onChange={handlePromoCodeChange}
                      className={`w-full px-4 py-3 bg-gray-800/80 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all ${
                        promoValid === true && !promoUsed
                          ? 'border-green-500'
                          : promoValid === false || promoUsed
                          ? 'border-red-500'
                          : 'border-gray-600'
                      }`}
                      placeholder="Enter promo code if you have one"
                      disabled={loading}
                    />
                    {promoValid === true && !promoUsed && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  </div>

                  {promoValid === true && !promoUsed && (
                    <p className="mt-1 text-xs text-green-400">
                      Valid promo code! You'll have premium access.
                    </p>
                  )}
                  {promoValid === false && promoCode && !promoUsed && (
                    <p className="mt-1 text-xs text-red-400">
                      Invalid promo code.
                    </p>
                  )}
                  {promoUsed && (
                    <p className="mt-1 text-xs text-red-400">
                      This promo code has already been used.
                    </p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="********"
                  required
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  disabled={loading}
                  minLength={6}
                />
              </div>
              {!isSignIn && (
                <p className="text-xs text-gray-400 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (promoCode && (promoValid === false || promoUsed)) || !!connectionError}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-semibold rounded-xl text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-amber-500/25"
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

            <p className="text-sm text-center text-gray-300">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                type="button"
                className="text-amber-400 hover:text-amber-300 font-medium"
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

        <div className="text-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
