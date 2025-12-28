import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Loader2, CheckCircle, AlertTriangle, RefreshCw, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useRetry } from '../hooks/useRetry';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

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

  const { signIn, signUp, signInWithGoogle, signInWithFacebook, signInWithApple, user, connectionError, retryConnection } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
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

  const handleGoogleSignIn = async () => {
    setSocialLoading('google');
    try {
      await signInWithGoogle();
    } finally {
      setSocialLoading(null);
    }
  };

  const handleFacebookSignIn = async () => {
    setSocialLoading('facebook');
    try {
      await signInWithFacebook();
    } finally {
      setSocialLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    setSocialLoading('apple');
    try {
      await signInWithApple();
    } finally {
      setSocialLoading(null);
    }
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

          {/* Social Sign-In Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={!!socialLoading || !!connectionError}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleFacebookSignIn}
              disabled={!!socialLoading || !!connectionError}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {socialLoading === 'facebook' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <FacebookIcon />
              )}
              Continue with Facebook
            </button>

            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={!!socialLoading || !!connectionError}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
            >
              {socialLoading === 'apple' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <AppleIcon />
              )}
              Continue with Apple
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email Toggle Button */}
          {!showEmailForm && (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-all duration-200"
            >
              <Mail className="w-5 h-5" />
              {isSignIn ? 'Sign in with Email' : 'Sign up with Email'}
            </button>
          )}

          {/* Email Form */}
          {showEmailForm && (
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
          )}

          {/* Toggle between Sign In / Sign Up for social buttons */}
          <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
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
                setShowEmailForm(false);
              }}
            >
              {isSignIn ? 'Create one' : 'Sign in'}
            </button>
          </p>
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
