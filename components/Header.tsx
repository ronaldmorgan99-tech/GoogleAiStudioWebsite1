import React, { useState } from 'react';
import { MenuIcon, XIcon, SearchIcon } from './icons';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';
import type { User } from '../types';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  currentUser: User | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, currentUser, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const baseNavLinks = [
    { name: 'Forums', href: '#' },
    { name: 'Members', href: '#' },
    { name: 'Store', href: '#' },
    { name: 'Discord', href: '#' },
  ];

  const navLinks = currentUser ? [...baseNavLinks, { name: 'Profile', href: '#' }] : baseNavLinks;
  
  const switchToSignUp = () => {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(true);
  };

  const switchToSignIn = () => {
    setIsSignUpModalOpen(false);
    setIsSignInModalOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log(`Searching for: ${searchQuery}`);
      // In a real app, you would trigger the search logic here.
    }
  };

  const handleNavClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-cz-gray-dark shadow-md relative pb-5">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <video 
                src="/generated_video_hd.mp4" 
                autoPlay 
                loop 
                muted 
                className="h-12 w-auto object-cover rounded-md"
              />
              <a href="#" onClick={(e) => handleNavClick(e, 'Forums')} className="text-white font-bold text-2xl tracking-wider">
                Night<span className="text-cz-primary">Respawn</span>
              </a>
              <nav className="hidden md:flex md:ml-10 md:space-x-8 items-center relative z-10">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.name)}
                    className="button text-sm font-medium"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={currentUser.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.name}`} 
                      alt={`${currentUser.name}'s avatar`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-sm text-cz-text">Welcome, <span className="font-bold text-white">{currentUser.name}</span>!</span>
                  </div>
                  <button
                    onClick={onSignOut}
                    className="text-cz-text bg-cz-gray hover:bg-cz-gray-light px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsSignInModalOpen(true)}
                    className="text-cz-text bg-cz-gray hover:bg-cz-gray-light px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsSignUpModalOpen(true)}
                    className="text-white bg-cz-primary hover:bg-cz-primary-hover px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-cz-text hover:text-white hover:bg-cz-gray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center mb-2">
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-cz-gray border border-cz-gray-light rounded-md py-1.5 pl-8 pr-2 text-sm focus:ring-cz-primary focus:border-cz-primary transition w-96"
                />
                <button type="submit" className="absolute inset-y-0 left-0 pl-2 flex items-center text-cz-text-dark hover:text-white transition-colors">
                  <span className="sr-only">Search</span>
                  <SearchIcon />
                </button>
              </form>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.name)}
                  className={`${currentPage === link.name ? 'text-white bg-cz-gray' : 'text-cz-text'} hover:bg-cz-gray hover:text-white block px-3 py-2 rounded-md text-base font-medium`}
                >
                  {link.name}
                </a>
              ))}
              {currentUser ? (
                <div className="border-t border-cz-gray-light mt-4 pt-4 px-1">
                   <div className="flex items-center mb-3 px-2">
                      <img src={currentUser.avatarUrl || `https://i.pravatar.cc/150?u=${currentUser.name}`} alt="Your avatar" className="h-10 w-10 rounded-full object-cover" />
                      <div className="ml-3">
                          <div className="text-base font-medium text-white">{currentUser.name}</div>
                          <div className="text-sm font-medium text-cz-text-dark">Welcome!</div>
                      </div>
                  </div>
                  <button
                    onClick={() => { onSignOut(); setIsMenuOpen(false); }}
                    className="block w-full text-center text-cz-text bg-cz-gray hover:bg-cz-gray-light px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-3 pt-4 pb-2">
                    <button
                        onClick={() => { setIsSignInModalOpen(true); setIsMenuOpen(false); }}
                        className="block w-full text-center text-cz-text bg-cz-gray hover:bg-cz-gray-light px-4 py-2 rounded-md text-sm font-medium transition-colors mb-2"
                        >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsSignUpModalOpen(true); setIsMenuOpen(false); }}
                        className="block w-full text-center text-white bg-cz-primary hover:bg-cz-primary-hover px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                        Create Account
                    </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cz-primary to-cz-primary-hover"></div>
      </header>
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} onSwitchToSignUp={switchToSignUp} />
      <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} onSwitchToSignIn={switchToSignIn} />
    </>
  );
};

export default Header;