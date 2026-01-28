import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { Capacitor } from '@capacitor/core';

export default function FloatingBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const isNative = Capacitor.isNativePlatform();

  const handleBack = async () => {
    await triggerHaptic('light');

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/home');
    }
  };

  const hiddenPaths = ['/', '/home', '/signin'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <button
      onClick={handleBack}
      className="fixed left-4 bottom-24 z-[999] w-14 h-14 rounded-full bg-brand-gold/90 hover:bg-brand-gold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center backdrop-blur-sm border-2 border-white/20 active:scale-95"
      style={{
        minWidth: '56px',
        minHeight: '56px',
        bottom: isNative ? '100px' : '96px',
      }}
      aria-label="Go back to previous page"
    >
      <ArrowLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
    </button>
  );
}
