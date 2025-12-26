import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Loader2, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
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

        const { error, success } = await signUp(email, password);
        if (error) {
          if (error.message.includes('user_already_exists')) {
            setError('An account with this email already exists. Please sign in instead.');
            setIsSignIn(true);
          } else {
            setError(error.message);
          }
        } else if (success) {
          const { data: { user: newUser } } = await supabase.auth.getUser();

          if (newUser) {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-black via-brand-black-light to-brand-black-dark">
      <div className="absolute inset-0 bg-gradient-radial from-brand-gold/10 via-transparent to-transparent" />

      <div className="relative w-full max-w-md">
        <div className="glass-panel p-8 bg-white/95 dark:bg-gray-800/95">
          <div className="text-center mb-8">
            <img
              src="/android-icon-192-192.png"
              alt="PIT-BOX.COM"
              className="w-24 h-24 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold mb-2">
              {isSignIn ? 'Sign In to PitBox' : 'Create PitBox Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isSignIn ? 'Welcome back!' : 'Join the winners circle'}
            </p>
          </div>

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
                    className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition"
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
                    className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition"
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
                      } focus:ring-2 focus:ring-brand-gold/20 outline-none transition`}
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
                className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition"
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
                className="w-full p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none transition"
                placeholder="••••••••"
                required
                autoComplete={isSignIn ? "current-password" : "new-password"}
                disabled={loading}
                minLength={6}
              />
              {!isSignIn && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (promoCode && (promoValid === false || promoUsed)) || !!connectionError}
              className="w-full bg-brand-gold text-white py-3 px-4 rounded-lg hover:bg-brand-gold-dark transition text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
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
                className="text-brand-gold hover:text-brand-gold-dark dark:text-brand-gold-light dark:hover:text-brand-gold font-medium"
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
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
