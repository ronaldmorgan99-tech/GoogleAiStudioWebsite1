export interface User {
  id: string;
  name: string;
  isStaff: boolean;
  avatarUrl?: string;
  joinDate?: string;
  totalPosts?: number;
}

export interface Post {
  title: string;
  authorName: string;
  authorIsStaff: boolean;
  timestamp: string;
}

export interface Thread {
  id: string;
  title: string;
  author: User;
  timestamp: string;
  replies: number;
  views: number;
  lastPost: Post;
}

export interface Forum {
  id: string;
  title:string;
  description: string;
  threads: number;
  posts: number;
  lastPost?: Post | null;
  icon: string;
  threadsData?: Thread[];
}

export interface ForumCategory {
  id: string;
  title: string;
  forums: Forum[];
}

export interface ForumStats {
  threads: number;
  posts: number;
  members: number;
}

export interface ForumData {
    categories: ForumCategory[];
    recentPosts: Post[];
    stats: ForumStats;
    staffOnline: User[];
    membersOnline: User[];
}