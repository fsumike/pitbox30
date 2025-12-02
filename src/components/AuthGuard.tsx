import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SignInPrompt from './SignInPrompt';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [showSignInPrompt, setShowSignInPrompt] = React.useState(false);

  // If authentication is required and user is not logged in
  if (requireAuth && !user) {
    // Show sign in prompt
    return (
      <SignInPrompt 
        isOpen={true}
        onClose={() => setShowSignInPrompt(false)}
        onSignIn={() => {
          setShowSignInPrompt(false);
          document.querySelector<HTMLButtonElement>('.sign-in-trigger')?.click();
        }}
      />
    );
  }

  // If user is logged in and trying to access auth pages (like landing)
  if (user && location.pathname === '/') {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

export default AuthGuard;