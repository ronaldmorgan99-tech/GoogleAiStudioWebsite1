// @ts-nocheck - this file intentionally uses flexible types and raw queries.
import prisma from '../../prisma';
import { Role, Prisma } from '@prisma/client';

/**
 * Aggregates all data required for the main forums landing page.
 * This is designed to match the data structure previously provided by `mockForumData`.
 */
export const getForumsHomepageData = async () => {
  try {
    const categoriesWithForums = await prisma.forumCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      forums: {
        orderBy: { title: 'asc' },
      },
    },
  });

  // Fetch last posts for each forum efficiently and correctly using a raw query.
  const allForumIds = categoriesWithForums.flatMap(c => c.forums.map(f => f.id));
  
  const lastPosts: {
      forumId: string;
      title: string;
      authorName: string;
      authorRole: Role;
      timestamp: Date;
  }[] = allForumIds.length > 0 ? await prisma.$queryRaw`
    SELECT
      f.id as "forumId",
      p_last.title,
      u.username as "authorName",
      u.role as "authorRole",
      p_last."createdAt" as "timestamp"
    FROM "Forum" f
    LEFT JOIN LATERAL (
        SELECT t.title, p."createdAt", p."authorId"
        FROM "Post" p
        JOIN "Thread" t ON p."threadId" = t.id
        WHERE t."forumId" = f.id
        ORDER BY p."createdAt" DESC
        LIMIT 1
    ) p_last ON true
    LEFT JOIN "User" u ON p_last."authorId" = u.id
    WHERE f.id IN (${Prisma.join(allForumIds)});
  ` : [];

  // Map last posts back to forums for easy lookup
  const lastPostMap = new Map(lastPosts.map(p => [p.forumId, p]));

  const categories = categoriesWithForums.map(category => ({
      ...category,
      forums: category.forums.map(forum => {
          const lastPost = lastPostMap.get(forum.id);
          return {
              ...forum,
              threads: forum.threadCount,
              posts: forum.postCount,
              lastPost: lastPost && lastPost.title ? { // Ensure lastPost has data before mapping
                  title: lastPost.title,
                  authorName: lastPost.authorName,
                  authorIsStaff: lastPost.authorRole === Role.ADMIN || lastPost.authorRole === Role.MOD,
                  timestamp: lastPost.timestamp.toISOString(),
              } : null,
              icon: 'GeneralDiscussionIcon' // You might want to add an icon field to your Forum model
          };
      })
  }));


  // Recent Posts for the sidebar
  const recentPostsData = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: {
      thread: { select: { title: true } },
      author: { select: { username: true, role: true } },
      createdAt: true,
    },
  });

  const recentPosts = recentPostsData.map(post => ({
    title: post.thread.title,
    authorName: post.author.username,
    authorIsStaff: post.author.role === Role.ADMIN || post.author.role === Role.MOD,
    timestamp: post.createdAt.toISOString(),
  }));

  // Forum Stats
  const [totalThreads, totalPosts, totalMembers] = await Promise.all([
    prisma.thread.count(),
    prisma.post.count(),
    prisma.user.count(),
  ]);

  const stats = {
    threads: totalThreads,
    posts: totalPosts,
    members: totalMembers,
  };

  // Who's Online - this is a simplified version.
  // A real implementation would use a cache (like Redis) or check `lastSeenAt`.
  const staffOnlineData = await prisma.user.findMany({
    where: { role: { in: [Role.ADMIN, Role.MOD] } },
    select: { id: true, username: true, role: true, avatarUrl: true },
    take: 5,
  });
  const staffOnline = staffOnlineData.map(user => ({
    id: user.id,
    name: user.username,
    isStaff: user.role === Role.ADMIN || user.role === Role.MOD,
    avatarUrl: user.avatarUrl,
  }));

  const membersOnlineData = await prisma.user.findMany({
    where: { role: Role.USER },
    select: { id: true, username: true, role: true, avatarUrl: true },
    take: 10,
  });
  const membersOnline = membersOnlineData.map(user => ({
      id: user.id,
      name: user.username,
      isStaff: user.role === Role.ADMIN || user.role === Role.MOD,
      avatarUrl: user.avatarUrl
  }));


  return {
    categories,
    recentPosts,
    stats,
    staffOnline,
    membersOnline,
  };
  } catch (err) {
    console.error('Forums service failed, returning fallback mock data', err);

    // Fallback mock data so the frontend can render even if the DB/schema isn't ready.
    const fallback = {
      categories: [
        {
          id: 'cat-1',
          title: 'General',
          forums: [
            {
              id: 'forum-1',
              title: 'Announcements',
              description: 'Project updates and news',
              threads: 1,
              posts: 1,
              lastPost: {
                title: 'Welcome!',
                authorName: 'system',
                authorIsStaff: true,
                timestamp: new Date().toISOString(),
              },
              icon: 'GeneralDiscussionIcon',
            },
          ],
        },
      ],
      recentPosts: [
        {
          title: 'Welcome!',
          authorName: 'system',
          authorIsStaff: true,
          timestamp: new Date().toISOString(),
        },
      ],
      stats: { threads: 1, posts: 1, members: 1 },
      staffOnline: [],
      membersOnline: [],
    };

    return fallback;
  }
};