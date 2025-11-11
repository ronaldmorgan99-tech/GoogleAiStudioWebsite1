
import React, { useEffect } from 'react';
import { XIcon } from './icons';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSwitchToSignUp }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in attempt');
    onClose(); // Mock sign in for now
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-cz-gray-dark rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md mx-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-white">
            Sign In to <span className="text-cz-primary">Night</span>Respawn
          </h2>
          <button onClick={onClose} className="text-cz-text-dark hover:text-white transition-colors">
            <span className="sr-only">Close</span>
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cz-text-dark mb-1">
                Username or Email
              </label>
              <input
                type="text"
                name="email"
                id="email"
                required
                className="w-full bg-cz-gray border border-cz-gray-light rounded-md py-2 px-3 text-cz-text focus:ring-cz-primary focus:border-cz-primary transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-cz-text-dark mb-1">
                  Password
                </label>
                <a href="#" className="text-sm text-cz-primary hover:underline">Forgot?</a>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                required
                className="w-full bg-cz-gray border border-cz-gray-light rounded-md py-2 px-3 text-cz-text focus:ring-cz-primary focus:border-cz-primary transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full text-white bg-cz-primary hover:bg-cz-primary-hover px-4 py-2.5 rounded-md text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cz-gray-dark focus:ring-cz-primary"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-cz-text-dark">
          Don't have an account?{' '}
          <button onClick={onSwitchToSignUp} className="text-cz-primary hover:underline font-medium">Create one</button>
        </p>

      </div>
    </div>
  );
};

export default SignInModal;