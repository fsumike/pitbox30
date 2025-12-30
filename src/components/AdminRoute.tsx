import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { isDesktopWeb } from '../utils/platform';
import LoadingSpinner from './LoadingSpinner';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isDesktopWeb()) {
      navigate('/');
    }
  }, [navigate]);

  if (!isDesktopWeb()) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!userProfile?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
