
import React from 'react';
import type { ForumCategory as ForumCategoryType, Forum, User } from '../types';
import ForumRow from './ForumRow';

interface ForumCategoryProps {
  category: ForumCategoryType;
  onViewForum: (forum: Forum) => void;
  currentUser: User | null;
}

const ForumCategory: React.FC<ForumCategoryProps> = ({ category, onViewForum }) => {

  return (
    <>
      <div className="bg-cz-gray-dark rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-cz-gray bg-opacity-50 border-b border-cz-gray-light">
          <h2 className="text-white text-lg font-bold">
            {category.title}
          </h2>
        </div>
        <div>
          {category.forums.map((forum, index) => (
            <ForumRow 
              key={forum.id} 
              forum={forum} 
              isLast={index === category.forums.length - 1} 
              onViewForum={onViewForum}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ForumCategory;