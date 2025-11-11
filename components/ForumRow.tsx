
import React from 'react';
import type { Forum } from '../types';
import { AnnouncementIcon, GeneralDiscussionIcon, RulesIcon, SupportIcon, OffTopicIcon, FeedbackIcon } from './icons';

interface ForumRowProps {
  forum: Forum;
  isLast: boolean;
  onViewForum: (forum: Forum) => void;
}

const iconMap: { [key: string]: React.ReactNode } = {
  AnnouncementIcon: <AnnouncementIcon />,
  RulesIcon: <RulesIcon />,
  GeneralDiscussionIcon: <GeneralDiscussionIcon />,
  OffTopicIcon: <OffTopicIcon />,
  FeedbackIcon: <FeedbackIcon />,
  SupportIcon: <SupportIcon />,
};


const ForumRow: React.FC<ForumRowProps> = ({ forum, isLast, onViewForum }) => {
  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center p-4 ${!isLast ? 'border-b border-cz-gray' : ''} hover:bg-cz-gray transition-colors duration-200`}>
      <div className="flex items-center w-full md:w-1/2 mb-4 md:mb-0">
        <div className="text-cz-primary mr-4 flex-shrink-0">
          {iconMap[forum.icon] || <GeneralDiscussionIcon />}
        </div>
        <div className="min-w-0">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onViewForum(forum); }} 
            className="font-bold text-white hover:text-cz-primary transition-colors"
          >
            {forum.title}
          </a>
          <p 
            className="text-sm text-cz-text-dark truncate"
            title={forum.description}
          >
            {forum.description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap w-full md:w-1/2 text-sm items-center">
        <div className="w-1/2 md:w-1/4 flex flex-col items-start md:items-center">
          <span className="font-semibold text-white">{(forum.threads || 0).toLocaleString()}</span>
          <span className="text-cz-text-dark">Threads</span>
        </div>
        <div className="w-1/2 md:w-1/4 flex flex-col items-start md:items-center">
          <span className="font-semibold text-white">{(forum.posts || 0).toLocaleString()}</span>
          <span className="text-cz-text-dark">Posts</span>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-start mt-4 md:mt-0 md:pl-4">
          {forum.lastPost ? (
            <>
              <a href="#" className="text-white hover:underline truncate w-full" title={forum.lastPost.title}>{forum.lastPost.title}</a>
              <div className="text-cz-text-dark w-full">
                by <span className={forum.lastPost.authorIsStaff ? "text-red-400 font-semibold" : "text-cz-primary"}>{forum.lastPost.authorName}</span>, {forum.lastPost.timestamp}
              </div>
            </>
          ) : (
            <div className="text-cz-text-dark">No posts yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumRow;