import type { ForumData } from './types';

export const mockForumData: ForumData = {
  categories: [
    {
      // FIX: Changed id from number to string to match ForumCategory type.
      id: '1',
      title: 'Community Hub',
      forums: [
        {
          // FIX: Changed id from number to string to match Forum type.
          id: '101',
          title: 'Announcements',
          description: 'Stay up-to-date with the latest news and announcements from the NightRespawn staff.',
          threads: 15,
          posts: 120,
          lastPost: {
            title: 'New Community Guidelines',
            authorName: 'Admin',
            authorIsStaff: true,
            timestamp: '2d ago',
          },
          icon: 'AnnouncementIcon',
          threadsData: [
            {
              // FIX: Changed id from number to string to match Thread type.
              id: '1011',
              title: 'New Community Guidelines',
              // FIX: Add missing id property to conform to User type.
              author: { id: 'admin', name: 'Admin', isStaff: true, avatarUrl: 'https://i.pravatar.cc/150?u=admin', joinDate: 'Jan 1, 2023', totalPosts: 42 },
              timestamp: '2d ago',
              replies: 25,
              views: 1800,
              lastPost: {
                title: 'Re: New Community Guidelines',
                authorName: 'CraftyCat',
                authorIsStaff: false,
                timestamp: '3h ago',
              }
            },
            {
              // FIX: Changed id from number to string to match Thread type.
              id: '1012',
              title: 'Scheduled Maintenance: This Weekend',
              // FIX: Add missing id property to conform to User type.
              author: { id: 'admin', name: 'Admin', isStaff: true, avatarUrl: 'https://i.pravatar.cc/150?u=admin', joinDate: 'Jan 1, 2023', totalPosts: 42 },
              timestamp: '4d ago',
              replies: 12,
              views: 950,
              lastPost: {
                title: 'Re: Scheduled Maintenance',
                authorName: 'WordSmith',
                authorIsStaff: false,
                timestamp: '1d ago',
              }
            }
          ]
        },
        {
          // FIX: Changed id from number to string to match Forum type.
          id: '102',
          title: 'Introductions & Welcomes',
          description: 'New to the community? Introduce yourself here and get to know other members.',
          threads: 250,
          posts: 1800,
          lastPost: {
            title: 'Hello from sunny California!',
            authorName: 'CraftyCat',
            authorIsStaff: false,
            timestamp: '5m ago',
          },
          icon: 'GeneralDiscussionIcon',
          threadsData: [
            {
              // FIX: Changed id from number to string to match Thread type.
              id: '1021',
              title: 'Hello from sunny California!',
              // FIX: Add missing id property to conform to User type.
              author: { id: 'craftycat', name: 'CraftyCat', isStaff: false, avatarUrl: 'https://i.pravatar.cc/150?u=craftycat', joinDate: 'Mar 15, 2023', totalPosts: 112 },
              timestamp: '5m ago',
              replies: 0,
              views: 1,
              lastPost: {
                title: 'Hello from sunny California!',
                authorName: 'CraftyCat',
                authorIsStaff: false,
                timestamp: '5m ago',
              }
            },
            {
              // FIX: Changed id from number to string to match Thread type.
              id: '1022',
              title: 'Greetings from the UK!',
              // FIX: Add missing id property to conform to User type.
              author: { id: 'knitwit', name: 'KnitWit', isStaff: false, avatarUrl: 'https://i.pravatar.cc/150?u=knitwit', joinDate: 'Feb 2, 2023', totalPosts: 78 },
              timestamp: '2h ago',
              replies: 5,
              views: 25,
              lastPost: {
                title: 'Re: Greetings from the UK!',
                authorName: 'PhotoFan',
                authorIsStaff: false,
                timestamp: '30m ago',
              }
            }
          ]
        },
      ],
    },
    {
      // FIX: Changed id from number to string to match ForumCategory type.
      id: '2',
      title: 'Creative Discussions',
      forums: [
        {
          // FIX: Changed id from number to string to match Forum type.
          id: '201',
          title: 'Painting & Illustration',
          description: 'Share your latest masterpieces, techniques, and get feedback.',
          threads: 540,
          posts: 8900,
          lastPost: {
            title: 'Re: My first oil painting',
            authorName: 'ArtisticAlice',
            authorIsStaff: false,
            timestamp: '1h ago',
          },
          icon: 'FeedbackIcon',
          threadsData: [
            {
              // FIX: Changed id from number to string to match Thread type.
              id: '2011',
              title: 'My first oil painting - CC welcome!',
              // FIX: Add missing id property to conform to User type.
              author: { id: 'artisticalice', name: 'ArtisticAlice', isStaff: false, avatarUrl: 'https://i.pravatar.cc/150?u=alice', joinDate: 'Jun 10, 2023', totalPosts: 230 },
              timestamp: '8h ago',
              replies: 15,
              views: 120,
              lastPost: {
                title: 'Re: My first oil painting',
                authorName: 'ArtisticAlice',
                authorIsStaff: false,
                timestamp: '1h ago',
              }
            }
          ]
        },
        {
          // FIX: Changed id from number to string to match Forum type.
          id: '202',
          title: 'Writing & Storytelling',
          description: 'Discuss plot ideas, share your stories, and overcome writer\'s block together.',
          threads: 320,
          posts: 5600,
          lastPost: {
            title: 'Need help with a character arc',
            authorName: 'WordSmith',
            authorIsStaff: false,
            timestamp: '22m ago',
          },
          icon: 'OffTopicIcon',
          threadsData: [], // Example of a forum with no threads
        },
      ],
    },
  ],
  recentPosts: [
    {
      title: 'Hello from sunny California!',
      authorName: 'CraftyCat',
      authorIsStaff: false,
      timestamp: '5m ago',
    },
    {
      title: 'Need help with a character arc',
      authorName: 'WordSmith',
      authorIsStaff: false,
      timestamp: '22m ago',
    },
    {
      title: 'Re: My first oil painting',
      authorName: 'ArtisticAlice',
      authorIsStaff: false,
      timestamp: '1h ago',
    },
    {
      title: 'How do you store your yarn?',
      authorName: 'KnitWit',
      authorIsStaff: false,
      timestamp: '3h ago',
    },
    {
      title: 'New Community Guidelines',
      authorName: 'Admin',
      authorIsStaff: true,
      timestamp: '2d ago',
    },
  ],
  stats: {
    threads: 1125,
    posts: 16420,
    members: 8530,
  },
  staffOnline: [
    // FIX: Add missing id property to conform to User type.
    { id: 'admin', name: 'Admin', isStaff: true, avatarUrl: 'https://i.pravatar.cc/150?u=admin', joinDate: 'Jan 1, 2023', totalPosts: 42 },
    // FIX: Add missing id property to conform to User type.
    { id: 'modsquad', name: 'ModSquad', isStaff: true, avatarUrl: 'https://i.pravatar.cc/150?u=modsquad', joinDate: 'Jan 2, 2023', totalPosts: 153 },
  ],
  membersOnline: [
    // FIX: Add missing id property to conform to User type.
    { id: 'craftycat', name: 'CraftyCat', isStaff: false, avatarUrl: 'https://i.pravatar.cc/150?u=craftycat', joinDate: 'Mar 15, 2023', totalPosts: 112 },
    // FIX: Add missing id property to conform to User type.
    { id: 'artisticalice', name: 'ArtisticAlice', isStaff: false, avatarUrl: 'https://i.pravatar.cc/150?u=alice', joinDate: 'Jun 10, 2023', totalPosts: 230 },
    // FIX: Add missing id property to conform to User type.
    { id: 'wordsmith', name: 'WordSmith', isStaff: false, avatarUrl: 'https://i.pravatar.cc/150?u=wordsmith', joinDate: 'Apr 5, 2023', totalPosts: 95 },
    // FIX: Add missing id property to conform to User type.
    { id: 'knitwit', name: 'KnitWit', isStaff: false, avatarUrl: 'https://i.pravatar.cc/150?u=knitwit', joinDate: 'Feb 2, 2023', totalPosts: 78 },
    // FIX: Add missing id property to conform to User type.
    { id: 'photofan', name: 'PhotoFan', isStaff: false, avatarUrl: 'https://i.pravatar.cc/150?u=photofan', joinDate: 'Jul 21, 2023', totalPosts: 41 },
  ],
};