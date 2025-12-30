import React, { useState, useEffect } from 'react';
import { Hash, Lock, Check, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import NumericKeypad from './NumericKeypad';

interface PinCodeManagerProps {
  userId: string;
}

function PinCodeManager({ userId }: PinCodeManagerProps) {
  const [pinEnabled, setPinEnabled] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPinDisplay, setShowPinDisplay] = useState(false);

  useEffect(() => {
    checkPinStatus();
  }, [userId]);

  const checkPinStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('pin_code_enabled')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setPinEnabled(data?.pin_code_enabled || false);
    } catch (err) {
      console.error('Error checking PIN status:', err);
    }
  };

  const handleNumberClick = (num: string) => {
    if (step === 'enter' && pinCode.length < 10) {
      setPinCode(prev => prev + num);
    } else if (step === 'confirm' && confirmPin.length < 10) {
      setConfirmPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (step === 'enter') {
      setPinCode(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const handleContinue = () => {
    if (pinCode.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    setError(null);
    setStep('confirm');
  };

  const handleSetPin = async () => {
    if (confirmPin !== pinCode) {
      setError('PIN codes do not match');
      setConfirmPin('');
      setStep('enter');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: rpcError } = await supabase
        .rpc('set_user_pin_code', {
          user_id: userId,
          pin_code: pinCode
        });

      if (rpcError) throw rpcError;

      setSuccess(true);
      setPinEnabled(true);
      setTimeout(() => {
        setSuccess(false);
        setShowSetup(false);
        setPinCode('');
        setConfirmPin('');
        setStep('enter');
      }, 2000);
    } catch (err: any) {
      console.error('Error setting PIN:', err);
      setError(err.message || 'Failed to set PIN code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisablePin = async () => {
    if (!confirm('Are you sure you want to disable PIN code login? You will need to use your email and password to sign in.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: rpcError } = await supabase
        .rpc('disable_user_pin_code', {
          user_id: userId
        });

      if (rpcError) throw rpcError;

      setPinEnabled(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      console.error('Error disabling PIN:', err);
      setError(err.message || 'Failed to disable PIN code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-gold/10">
            <Hash className="w-6 h-6 text-brand-gold" />
          </div>
          <div>
            <h3 className="font-semibold">Quick PIN Sign-In</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {pinEnabled ? 'PIN code is enabled' : 'Fast track-side authentication'}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          pinEnabled
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}>
          {pinEnabled ? 'Enabled' : 'Disabled'}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 flex items-center gap-2">
          <Check className="w-5 h-5 flex-shrink-0" />
          PIN code updated successfully!
        </div>
      )}

      {!pinEnabled && !showSetup && (
        <div className="space-y-4">
          <div className="bg-brand-gold/10 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Why use a PIN code?
            </h4>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
              <li>• Quick sign-in at the track - no typing required</li>
              <li>• Easy to enter on mobile devices</li>
              <li>• Secure and convenient for frequent access</li>
              <li>• Works alongside your email and password</li>
            </ul>
          </div>

          <button
            onClick={() => setShowSetup(true)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Hash className="w-5 h-5" />
            Set Up PIN Code
          </button>
        </div>
      )}

      {showSetup && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              {step === 'enter' ? 'Create Your PIN Code' : 'Confirm Your PIN Code'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {step === 'enter'
                ? 'Enter a PIN code (4-10 digits)'
                : 'Re-enter your PIN to confirm'}
            </p>
          </div>

          <div>
            <div className="flex justify-center gap-3 mb-4">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
                const currentPin = step === 'enter' ? pinCode : confirmPin;
                return (
                  <div
                    key={i}
                    className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all ${
                      currentPin.length > i
                        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold scale-110'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {currentPin.length > i ? (showPinDisplay ? currentPin[i] : '•') : ''}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mb-4">
              <button
                type="button"
                onClick={() => setShowPinDisplay(!showPinDisplay)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-gold flex items-center gap-2"
              >
                {showPinDisplay ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide PIN
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show PIN
                  </>
                )}
              </button>
            </div>

            <NumericKeypad
              onNumberClick={handleNumberClick}
              onBackspace={handleBackspace}
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowSetup(false);
                setPinCode('');
                setConfirmPin('');
                setStep('enter');
                setError(null);
              }}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            {step === 'enter' ? (
              <button
                onClick={handleContinue}
                disabled={loading || pinCode.length < 4}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSetPin}
                disabled={loading || confirmPin.length < 4}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Setting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirm PIN
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {pinEnabled && !showSetup && (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300">
              Your PIN code is active. You can now use it to quickly sign in to PitBox at the track.
              Just click "Quick Sign In with PIN" on the sign-in page.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowSetup(true);
                setPinCode('');
                setConfirmPin('');
                setStep('enter');
              }}
              disabled={loading}
              className="flex-1 btn-secondary"
            >
              Change PIN
            </button>

            <button
              onClick={handleDisablePin}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Disable PIN'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PinCodeManager;
