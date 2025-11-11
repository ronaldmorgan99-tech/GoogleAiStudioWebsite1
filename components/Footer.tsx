import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-cz-gray-dark mt-10 border-t border-cz-gray-light">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-cz-text-dark">
        <p>&copy; {new Date().getFullYear()} NightRespawn. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-cz-primary transition-colors">Contact Us</a>
          <a href="#" className="hover:text-cz-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-cz-primary transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;