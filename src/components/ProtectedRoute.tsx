import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStripe } from '../contexts/StripeContext';
import SignInPrompt from './SignInPrompt';
import { supabase } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPremium?: boolean;
}

function ProtectedRoute({ children, requiresPremium = false }: ProtectedRouteProps) {
  const { user, connectionError } = useAuth();
  const { subscriptionStatus, isLoading } = useStripe();
  const location = useLocation();
  const [showSignInPrompt, setShowSignInPrompt] = React.useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = React.useState(false);
  const [checkingTerms, setCheckingTerms] = React.useState(true);

  // Allow guest access to bypass authentication
  const allowGuestAccess = true;

  React.useEffect(() => {
    if (user) {
      checkTermsAcceptance();
    } else {
      setCheckingTerms(false);
    }
  }, [user]);

  const checkTermsAcceptance = async () => {
    try {
      const { data, error } = await supabase
        .from('terms_acceptance')
        .select('*')
        .eq('user_id', user?.id)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking terms acceptance:', error);
      }
      
      setHasAcceptedTerms(!!data);
    } catch (err) {
      console.error('Error checking terms acceptance:', err);
    } finally {
      setCheckingTerms(false);
    }
  };

  if (checkingTerms) {
    return <div>Loading...</div>;
  }

  // If guest access is allowed, render the children regardless of authentication
  if (allowGuestAccess) {
    return <>{children}</>;
  }

  if (!user) {
    // Show sign in prompt for non-authenticated users
    return (
      <>
        <SignInPrompt 
          isOpen={true}
          onClose={() => setShowSignInPrompt(false)}
          onSignIn={() => {
            setShowSignInPrompt(false);
            document.querySelector<HTMLButtonElement>('.sign-in-trigger')?.click();
          }}
        />
        <Navigate to="/" state={{ from: location }} replace />
      </>
    );
  }

  if (!hasAcceptedTerms && location.pathname !== '/terms-of-service') {
    // Redirect to terms of service page if user hasn't accepted terms
    return <Navigate to="/terms-of-service" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (requiresPremium && subscriptionStatus !== 'premium') {
    // Redirect non-premium users to upgrade page
    return <Navigate to="/subscription" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;