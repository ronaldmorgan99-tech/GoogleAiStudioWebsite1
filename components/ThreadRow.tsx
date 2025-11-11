import React from 'react';
import type { Thread, User } from '../types';
import { ThreadIcon } from './icons';

interface ThreadRowProps {
  thread: Thread;
  isLast: boolean;
  isRead: boolean;
  onViewProfile: (user: User) => void;
}

const ThreadRow: React.FC<ThreadRowProps> = ({ thread, isLast, isRead, onViewProfile }) => {
  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center p-4 ${!isLast ? 'border-b border-cz-gray' : ''} border-l-2 border-transparent hover:border-cz-primary hover:bg-cz-gray transition-colors duration-200 cursor-pointer`}>
      <div className="flex items-center w-full md:w-1/2 mb-4 md:mb-0">
        <div className={`mr-4 flex-shrink-0 transition-colors ${isRead ? 'text-cz-gray-light' : 'text-cz-text-dark'}`}>
           <ThreadIcon />
        </div>
        <div>
          <a 
            href="#" 
            className={`block transition-colors ${isRead ? 'font-normal text-cz-text-dark hover:text-cz-primary' : 'font-bold text-white hover:text-cz-primary'}`}
          >
            {thread.title}
          </a>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onViewProfile(thread.author); }}
            className="flex items-center group text-sm text-cz-text-dark mt-1"
          >
              <img
                src={thread.author.avatarUrl || `https://i.pravatar.cc/150?u=${thread.author.name}`}
                alt={`${thread.author.name}'s avatar`}
                className="w-5 h-5 rounded-full mr-2 object-cover group-hover:ring-2 group-hover:ring-cz-primary transition-all"
              />
              <span>
                by <span className={`${thread.author.isStaff ? "text-red-400 font-semibold" : "text-cz-primary"} group-hover:underline`}>{thread.author.name}</span>, {thread.timestamp}
              </span>
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap w-full md:w-1/2 text-sm items-center">
        <div className="w-1/2 md:w-1/4 flex flex-col items-start md:items-center">
          <span className="font-semibold text-white">{thread.replies.toLocaleString()}</span>
          <span className="text-cz-text-dark">Replies</span>
        </div>
        <div className="w-1/2 md:w-1/4 flex flex-col items-start md:items-center">
          <span className="font-semibold text-white">{thread.views.toLocaleString()}</span>
          <span className="text-cz-text-dark">Views</span>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-start mt-4 md:mt-0 md:pl-4">
          <a 
            href="#" 
            className={`hover:underline truncate w-full transition-colors ${isRead ? 'text-cz-text-dark' : 'text-white'}`} 
            title={thread.lastPost.title}
          >
            {thread.lastPost.title}
          </a>
          <div className="text-cz-text-dark w-full">
            by <span className={thread.lastPost.authorIsStaff ? "text-red-400 font-semibold" : "text-cz-primary"}>{thread.lastPost.authorName}</span>, {thread.lastPost.timestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadRow;
