import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// List of valid promo codes
const validPromoCodes = [
  'Silva57', 'Daniels5', 'Larson57', 'Colby5', 'Andy92', 'Brad49', 'Kyle54', 'Kaleb3',
  'Slingin18', 'Claygrip33', 'Highline22', 'Dirtdog77', 'Slidejob04', 'Cushion55',
  'Roostertail81', 'Gasit49', 'Sprintcar92', 'Latemodel68', 'Bullring11', 'Checkered99',
  'Fullthrottle07', 'Redclay36', 'Wheelie29', 'Chassis14', 'Featurewin63', 'Trackside70',
  'Pitside88', 'Glorylaps44', 'Pitboxmike',
  'PITBOXPRO', 'RACEWINNER', 'SETUPKING', 'TRACKMASTER', 'SPEEDFREAK', 'CHAMPION24',
  'GOLDENGRID', 'VICTORYLAP', 'FASTTRACK', 'DIRTLEGEND', 'CHECKEREDPRO', 'ENGINEEREDWIN',
  'NITROBOOST', 'APEXPREMIUM', 'PODIUMPASS', 'VELOCITYMAX', 'ACCELERATE', 'ELITERACER',
  'PROPERFORMANCE', 'PITBOXVIP', 'Chaz44', 'Chaz33', 'Chaz22', 'Chaz55', 'Chaz11'
];

const unlimitedUseCodes = ['REVIEWER2025', 'APPREVIEW', 'PITBOXTEST'];

export function usePromoCode() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isUnlimitedCode = (code: string): boolean => {
    return unlimitedUseCodes.some(c => c.toUpperCase() === code.toUpperCase());
  };

  const validatePromoCode = (code: string): boolean => {
    if (!code) return false;

    if (isUnlimitedCode(code)) return true;

    const normalizedCode = code.toLowerCase();
    const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);

    return validPromoCodes.includes(capitalizedCode);
  };

  /**
   * Checks if a promo code has already been used
   * @param code The promo code to check
   * @returns Whether the code has already been used
   */
  const checkPromoCodeUsed = async (code: string): Promise<boolean> => {
    try {
      // Normalize the code: lowercase everything, then capitalize first letter
      const normalizedCode = code.toLowerCase();
      const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);
      
      // Check if any user has already used this promo code
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('promo_code', capitalizedCode)
        .limit(1);
        
      if (error) throw error;
      
      // If data exists, the promo code has already been used
      return data && data.length > 0;
    } catch (err) {
      console.error('Error checking if promo code is used:', err);
      throw err;
    }
  };

  /**
   * Applies a promo code to the current user
   * @param code The promo code to apply
   * @returns Whether the operation was successful
   */
  const applyPromoCode = async (code: string): Promise<boolean> => {
    if (!user) {
      setError('You must be signed in to apply a promo code');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Validate the promo code
      if (!validatePromoCode(code)) {
        setError('Invalid promo code');
        return false;
      }

      const normalizedCode = code.toLowerCase();
      const capitalizedCode = normalizedCode.charAt(0).toUpperCase() + normalizedCode.slice(1);
      const finalCode = isUnlimitedCode(code) ? code.toUpperCase() : capitalizedCode;

      if (!isUnlimitedCode(code)) {
        const isUsed = await checkPromoCodeUsed(capitalizedCode);
        if (isUsed) {
          setError('This promo code has already been used');
          return false;
        }
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          promo_code: finalCode,
          has_premium: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return true;
    } catch (err) {
      console.error('Error applying promo code:', err);
      setError('Failed to apply promo code');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Checks if the current user has premium access
   * @returns Whether the user has premium access
   */
  const checkPremiumStatus = async (): Promise<boolean> => {
    if (!user) {
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('has_premium')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return data?.has_premium || false;
    } catch (err) {
      console.error('Error checking premium status:', err);
      setError('Failed to check premium status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    validatePromoCode,
    applyPromoCode,
    checkPremiumStatus,
    loading,
    error
  };
}