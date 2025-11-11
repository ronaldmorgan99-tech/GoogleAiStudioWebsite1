
import React, { useState, useEffect } from 'react';
import ForumCategory from '../components/ForumCategory';
import Sidebar from '../components/Sidebar';
import type { ForumCategory as ForumCategoryType, Post, ForumStats, User, Forum } from '../types';
import { api, ForumsHomepageData } from '../web/sdk';
import LoadingSpinner from '../components/LoadingSpinner';

interface ForumsProps {
  onViewForum: (forum: Forum) => void;
  currentUser: User | null;
}

// Utility to format ISO date strings into a readable format like "5m ago"
const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};


const Forums: React.FC<ForumsProps> = ({
  onViewForum,
  currentUser,
}) => {
  const [data, setData] = useState<ForumsHomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.getForumsHomepage();

        // The API returns the exact shape, but timestamps need formatting
        const formattedResult: ForumsHomepageData = {
            ...result,
            recentPosts: result.recentPosts.map(p => ({...p, timestamp: timeAgo(p.timestamp)})),
            categories: result.categories.map(c => ({
                ...c,
                forums: c.forums.map(f => ({
                    ...f,
                    lastPost: f.lastPost ? {...f.lastPost, timestamp: timeAgo(f.lastPost.timestamp)} : null
                }))
            }))
        };
        setData(formattedResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load forum data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-400 bg-cz-gray-dark p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>{error || 'Forum data could not be loaded.'}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="w-full lg:w-2/3 flex flex-col gap-6">
        {data.categories.map(category => (
          <ForumCategory
            key={category.id}
            category={category as ForumCategoryType} // Cast needed due to looser type on sdk
            onViewForum={onViewForum}
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/3">
        <Sidebar
          recentPosts={data.recentPosts as Post[]}
          forumStats={data.stats as ForumStats}
          staffOnline={data.staffOnline as User[]}
          membersOnline={data.membersOnline as User[]}
        />
      </div>
    </div>
  );
};

export default Forums;
