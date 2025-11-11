import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';
// FIX: Import exit from process to handle type errors on process.exit
import { exit } from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const password = await argon2.hash('password123');

  // Create Users
  const admin = await prisma.user.create({
    data: {
      username: 'Admin',
      email: 'admin@nightrespawn.com',
      passwordHash: password,
      role: Role.ADMIN,
      avatarUrl: 'https://i.pravatar.cc/150?u=admin',
      totalPosts: 5,
    },
  });

  const moderator = await prisma.user.create({
    data: {
      username: 'ModSquad',
      email: 'mod@nightrespawn.com',
      passwordHash: password,
      role: Role.MOD,
      avatarUrl: 'https://i.pravatar.cc/150?u=modsquad',
      totalPosts: 2,
    },
  });
  
  const user1 = await prisma.user.create({
    data: {
      username: 'CraftyCat',
      email: 'cat@nightrespawn.com',
      passwordHash: password,
      role: Role.USER,
      avatarUrl: 'https://i.pravatar.cc/150?u=craftycat',
      totalPosts: 2,
    },
  });
  
  const user2 = await prisma.user.create({
    data: {
      username: 'WordSmith',
      email: 'smith@nightrespawn.com',
      passwordHash: password,
      role: Role.USER,
      avatarUrl: 'https://i.pravatar.cc/150?u=wordsmith',
      totalPosts: 1,
    },
  });

  // Create Forum Categories
  const communityHub = await prisma.forumCategory.create({
    data: {
      title: 'Community Hub',
      order: 1,
    },
  });

  const creativeDiscussions = await prisma.forumCategory.create({
    data: {
      title: 'Creative Discussions',
      order: 2,
    },
  });

  // Create Forums
  const announcements = await prisma.forum.create({
    data: {
      categoryId: communityHub.id,
      title: 'Announcements',
      description: 'Stay up-to-date with the latest news and announcements from the NightRespawn staff.',
    },
  });

  const introductions = await prisma.forum.create({
    data: {
      categoryId: communityHub.id,
      title: 'Introductions & Welcomes',
      description: 'New to the community? Introduce yourself here and get to know other members.',
    },
  });

  const painting = await prisma.forum.create({
    data: {
      categoryId: creativeDiscussions.id,
      title: 'Painting & Illustration',
      description: 'Share your latest masterpieces, techniques, and get feedback.',
    },
  });

  // Create Threads and Posts
  const guidelinesThread = await prisma.thread.create({
    data: {
      forumId: announcements.id,
      authorId: admin.id,
      title: 'New Community Guidelines',
      posts: {
        create: {
          authorId: admin.id,
          content: 'Welcome everyone! We have updated our community guidelines. Please take a moment to read them.',
        },
      },
    },
  });
  await prisma.post.create({
    data: {
        threadId: guidelinesThread.id,
        authorId: user1.id,
        content: 'Thanks for the update! Looking good.',
    }
  });


  const helloThread = await prisma.thread.create({
    data: {
      forumId: introductions.id,
      authorId: user1.id,
      title: 'Hello from sunny California!',
      posts: {
        create: {
          authorId: user1.id,
          content: 'Hey everyone, just joined! Excited to be here and share some of my craft projects.',
        },
      },
    },
  });
  
  const oilPaintingThread = await prisma.thread.create({
    data: {
      forumId: painting.id,
      authorId: user2.id,
      title: 'My first oil painting - CC welcome!',
      posts: {
        create: {
          authorId: user2.id,
          content: 'Just finished my first piece. It was a learning experience! Any feedback is appreciated.',
        },
      },
    },
  });

  // Create Store Items
  await prisma.storeItem.create({
    data: {
        name: 'NightRespawn Hoodie',
        slug: 'nightrespawn-hoodie',
        priceCents: 4999,
        stock: 100,
        shortDesc: 'Stay cozy with our official branded hoodie.',
        longDesc: 'A premium, comfortable hoodie made from 100% organic cotton. Features an embroidered NightRespawn logo. Perfect for late-night gaming sessions.',
        isActive: true,
        imageUrl: 'https://via.placeholder.com/400'
    }
  });

   await prisma.storeItem.create({
    data: {
        name: 'NightRespawn Mug',
        slug: 'nightrespawn-mug',
        priceCents: 1499,
        stock: 250,
        shortDesc: 'The perfect companion for your favorite beverage.',
        longDesc: 'A sturdy ceramic mug with a high-quality print of the NightRespawn logo. Dishwasher and microwave safe.',
        isActive: true,
        imageUrl: 'https://via.placeholder.com/400'
    }
  });


  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    // FIX: Changed process.exit(1) to exit(1) to use the imported function and resolve the type error.
    exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
