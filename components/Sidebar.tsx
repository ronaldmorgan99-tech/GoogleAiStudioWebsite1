
import React from 'react';
import type { Post, ForumStats, User } from '../types';

interface SidebarProps {
  recentPosts: Post[];
  forumStats: ForumStats;
  staffOnline: User[];
  membersOnline: User[];
}

const SidebarBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-cz-gray-dark rounded-lg shadow-lg mb-6">
        <h3 className="text-white text-md font-bold p-3 bg-cz-gray bg-opacity-50 border-b border-cz-gray-light rounded-t-lg">
            {title}
        </h3>
        <div className="p-4">
            {children}
        </div>
    </div>
);

const UserLink: React.FC<{ user: User }> = ({ user }) => (
    <a href="#" className={user.isStaff ? "text-red-400 font-semibold hover:underline" : "text-cz-primary hover:underline"}>
        {user.name}
    </a>
);

const Sidebar: React.FC<SidebarProps> = ({ recentPosts, forumStats, staffOnline, membersOnline }) => {
  return (
    <aside>
      <SidebarBlock title="Recent Posts">
        <ul className="space-y-3">
          {recentPosts.map((post, index) => (
            <li key={index} className="text-sm">
              <a href="#" className="text-white hover:text-cz-primary transition-colors block truncate">{post.title}</a>
              <span className="text-cz-text-dark">by <UserLink user={{ id: post.authorName, name: post.authorName, isStaff: post.authorIsStaff }} />, {post.timestamp}</span>
            </li>
          ))}
        </ul>
      </SidebarBlock>

      <SidebarBlock title="Forum Stats">
        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span className="text-cz-text-dark">Threads:</span>
            <span className="text-white font-semibold">{forumStats.threads.toLocaleString()}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-cz-text-dark">Posts:</span>
            <span className="text-white font-semibold">{forumStats.posts.toLocaleString()}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-cz-text-dark">Members:</span>
            <span className="text-white font-semibold">{forumStats.members.toLocaleString()}</span>
          </li>
        </ul>
      </SidebarBlock>
      
      <SidebarBlock title="Who's Online">
        <div>
            <h4 className="font-semibold text-white mb-2 text-sm">Staff Online</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm mb-4">
                {staffOnline.length > 0 ? staffOnline.map(user => <UserLink key={user.id} user={user} />) : <span className="text-cz-text-dark">None</span>}
            </div>

            <h4 className="font-semibold text-white mb-2 text-sm">Members Online ({membersOnline.length})</h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {membersOnline.map(user => <UserLink key={user.id} user={user} />)}
            </div>
        </div>
      </SidebarBlock>
    </aside>
  );
};

export default Sidebar;