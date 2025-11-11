import React, { useEffect } from 'react';
import { XIcon } from './icons';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose, onSwitchToSignIn }) => {
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
    console.log('Sign up attempt');
    onClose(); // Mock sign up for now
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      aria-labelledby="modal-title-signup"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-cz-gray-dark rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md mx-4 transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="modal-title-signup" className="text-2xl font-bold text-white">
            Create an Account
          </h2>
          <button onClick={onClose} className="text-cz-text-dark hover:text-white transition-colors">
            <span className="sr-only">Close</span>
            <XIcon />
          </button>
        </div>

        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username-signup" className="block text-sm font-medium text-cz-text-dark mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username-signup"
                required
                className="w-full bg-cz-gray border border-cz-gray-light rounded-md py-2 px-3 text-cz-text focus:ring-cz-primary focus:border-cz-primary transition"
                placeholder="ProGamer123"
              />
            </div>
            <div>
              <label htmlFor="email-signup" className="block text-sm font-medium text-cz-text-dark mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email-signup"
                required
                className="w-full bg-cz-gray border border-cz-gray-light rounded-md py-2 px-3 text-cz-text focus:ring-cz-primary focus:border-cz-primary transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password-signup" className="block text-sm font-medium text-cz-text-dark mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password-signup"
                required
                className="w-full bg-cz-gray border border-cz-gray-light rounded-md py-2 px-3 text-cz-text focus:ring-cz-primary focus:border-cz-primary transition"
                placeholder="••••••••"
              />
            </div>
             <div>
              <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-cz-text-dark mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password-signup"
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
              Create Account
            </button>
          </div>
        </form>
        
        <p className="mt-6 text-center text-sm text-cz-text-dark">
          Already have an account?{' '}
          <button onClick={onSwitchToSignIn} className="text-cz-primary hover:underline font-medium">Sign In</button>
        </p>

      </div>
    </div>
  );
};

export default SignUpModal;