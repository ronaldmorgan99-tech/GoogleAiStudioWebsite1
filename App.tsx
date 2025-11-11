
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Forums from './pages/Forums';
import Members from './pages/Members';
import Store from './pages/Store';
import Discord from './pages/Discord';
import ForumView from './pages/ForumView';
import Profile from './pages/Profile';
import type { Forum, User } from './types';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('Forums');
  const [viewingForum, setViewingForum] = useState<Forum | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user session on initial load
  useEffect(() => {
    const fetchMe = async () => {
      try {
        // This is a simplified fetch; a real SDK would handle this
        const res = await fetch('/api/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          // Map API user to frontend User type
          const user: User = {
            id: data.user.id,
            name: data.user.username,
            isStaff: data.user.role === 'ADMIN' || data.user.role === 'MOD',
            avatarUrl: data.user.avatarUrl,
            joinDate: new Date(data.user.joinDate).toLocaleDateString(),
            totalPosts: data.user.totalPosts,
          };
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Not logged in", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleNavigate = (page: string) => {
    setViewingForum(null);
    setViewingUser(null);
    setCurrentPage(page);
    if (page === 'Profile' && currentUser) {
      setViewingUser(currentUser);
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setCurrentUser(null);
    setViewingUser(null);
    setCurrentPage('Forums'); // Go to home page after sign out
  };
  
  const handleViewProfile = (user: User) => {
    setViewingForum(null);
    setViewingUser(user);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
    }

    if (viewingForum) {
      return <ForumView forum={viewingForum} onBack={() => setViewingForum(null)} currentUser={currentUser} onViewProfile={handleViewProfile} />;
    }
    if (viewingUser) {
      return <Profile user={viewingUser} onBack={() => setViewingUser(null)} />;
    }

    switch (currentPage) {
      case 'Members':
        return <Members />;
      case 'Store':
        return <Store />;
      case 'Discord':
        return <Discord />;
      case 'Forums':
      default:
        return (
          <Forums
            onViewForum={setViewingForum}
            currentUser={currentUser}
          />
        );
    }
  };

  return (
    <div className="bg-cz-dark text-cz-text min-h-screen font-sans">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 w-full">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;