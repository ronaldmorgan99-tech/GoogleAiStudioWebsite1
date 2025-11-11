import React, { useState } from 'react';
import type { Forum, Thread, Post, User } from '../types';
import CreateThreadModal from '../components/CreatePostModal';
import ThreadRow from '../components/ThreadRow';
import { PlusIcon } from '../components/icons';

interface ForumViewProps {
  forum: Forum;
  onBack: () => void;
  currentUser: User | null;
  onViewProfile: (user: User) => void;
}

const ForumView: React.FC<ForumViewProps> = ({ forum, onBack, currentUser, onViewProfile }) => {
  const [isCreateThreadModalOpen, setCreateThreadModalOpen] = useState(false);
  const [allThreadsRead, setAllThreadsRead] = useState(false);
  const [threads, setThreads] = useState<Thread[]>(forum.threadsData || []);

  const handleAddThread = (title: string, body: string) => {
    if (!currentUser) {
        // In a real app, you might show an error or prompt login
        console.error("No user is logged in to create a thread.");
        return;
    }

    const newPost: Post = {
        title: title,
        authorName: currentUser.name,
        authorIsStaff: currentUser.isStaff,
        timestamp: 'Just now',
    };

    const newThread: Thread = {
        // FIX: Changed Date.now() to a string to match the Thread type.
        id: Date.now().toString(),
        title: title,
        author: currentUser,
        timestamp: 'Just now',
        replies: 0,
        views: 1,
        lastPost: newPost,
    };
    
    setThreads(prevThreads => [newThread, ...prevThreads]);
  };

  return (
    <>
      <div className="bg-cz-gray-dark rounded-lg shadow-lg">
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-cz-gray-light pb-4 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-white">{forum.title}</h1>
                <p className="text-cz-text-dark mt-1">{forum.description}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-center">
                <button
                onClick={onBack}
                className="text-cz-text bg-cz-gray hover:bg-cz-gray-light px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                &larr; Back
                </button>
                <button
                  onClick={() => setAllThreadsRead(true)}
                  disabled={allThreadsRead}
                  className="text-cz-text bg-cz-gray hover:bg-cz-gray-light px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {allThreadsRead ? 'All Read' : 'Mark Read'}
                </button>
                <button
                onClick={() => setCreateThreadModalOpen(true)}
                className="flex items-center text-white bg-cz-primary hover:bg-cz-primary-hover px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                <PlusIcon />
                <span className="ml-2">New Thread</span>
                </button>
            </div>
            </div>
        </div>
        
        <div>
          {threads.length > 0 ? (
            <div>
              {threads.map((thread, index) => (
                <ThreadRow 
                  key={thread.id} 
                  thread={thread}
                  isLast={index === threads.length - 1}
                  isRead={allThreadsRead}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6">
              <p className="text-cz-text">There are no threads in this forum yet.</p>
            </div>
          )}
        </div>
      </div>
      <CreateThreadModal
        isOpen={isCreateThreadModalOpen}
        onClose={() => setCreateThreadModalOpen(false)}
        categoryTitle={forum.title}
        onAddThread={handleAddThread}
      />
    </>
  );
};

export default ForumView;