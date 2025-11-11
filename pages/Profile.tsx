import React from 'react';
import type { User } from '../types';

interface ProfileProps {
  user: User;
  onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
  return (
    <>
      <div className="mb-4">
        <button
          onClick={onBack}
          className="text-cz-text bg-cz-gray hover:bg-cz-gray-light px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          &larr; Back
        </button>
      </div>
      <div className="bg-cz-gray-dark rounded-lg shadow-lg p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Avatar and Stats Column */}
          <div className="flex-shrink-0 w-full sm:w-48 text-center">
            <img
              src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.name}`}
              alt={`${user.name}'s avatar`}
              className="w-40 h-40 rounded-full mx-auto border-4 border-cz-primary object-cover"
            />
            <h1 className="text-3xl font-bold text-white mt-4 break-words">{user.name}</h1>
            {user.isStaff && (
              <p className="text-red-400 font-semibold mt-1">Staff Member</p>
            )}
            <div className="mt-6 text-left bg-cz-gray rounded-lg p-4">
                <h3 className="text-white font-bold mb-3 border-b border-cz-gray-light pb-2">Stats</h3>
                <ul className="text-sm space-y-2">
                    <li className="flex justify-between items-center">
                      <span className="text-cz-text-dark">Joined:</span> 
                      <span className="text-white font-medium">{user.joinDate || 'N/A'}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-cz-text-dark">Posts:</span> 
                      <span className="text-white font-medium">{(user.totalPosts || 0).toLocaleString()}</span>
                    </li>
                </ul>
            </div>
          </div>

          {/* Main Profile Content Column */}
          <div className="flex-grow w-full">
            <div className="bg-cz-gray rounded-lg p-6">
              <h2 className="text-xl font-bold text-white border-b border-cz-gray-light pb-3 mb-4">
                About Me
              </h2>
              <p className="text-cz-text leading-relaxed">
                This is a placeholder for the user's biography or recent activity. In a full application, users could customize this section from their profile settings. It could contain information about their hobbies, interests, or a personal message to the community.
              </p>
            </div>

            <div className="bg-cz-gray rounded-lg p-6 mt-6">
              <h2 className="text-xl font-bold text-white border-b border-cz-gray-light pb-3 mb-4">
                Recent Activity
              </h2>
              <p className="text-cz-text-dark">
                User's recent posts and threads would appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;