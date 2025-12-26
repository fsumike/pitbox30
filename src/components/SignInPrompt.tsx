import React from 'react';
import { Trophy, LogIn, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SignInPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

function SignInPrompt({ isOpen, onClose, onSignIn }: SignInPromptProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSignIn = () => {
    navigate('/signin');
    onClose();
  };

  const handleContinueAsGuest = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-brand-gold/10 mb-4">
              <Trophy className="w-12 h-12 text-brand-gold" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Join the Winners Circle!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Unlock the full potential of PIT-BOX.COM - the most advanced setup management 
              tool in racing. Champions trust us for their success!
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-gold/5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                ✓
              </div>
              <p className="text-sm">Save unlimited setup configurations</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-gold/5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                ✓
              </div>
              <p className="text-sm">Track changes across different conditions</p>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-gold/5">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center">
                ✓
              </div>
              <p className="text-sm">Access your setups from anywhere</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleSignIn}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In Now
            </button>
            
            <button
              onClick={handleContinueAsGuest}
              className="w-full btn-secondary"
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInPrompt;