// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data in correct order
  await prisma.notification.deleteMany()
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('password123', 10)

  // Create users
  const john = await prisma.user.create({
    data: {
      username: 'john_doe',
      email: 'john@example.com',
      password,
      bio: 'Full-stack developer | Coffee addict ☕',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
  })

  const jane = await prisma.user.create({
    data: {
      username: 'jane_smith',
      email: 'jane@example.com',
      password,
      bio: 'UX Designer & Dog lover 🐕',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
  })

  const alex = await prisma.user.create({
    data: {
      username: 'alex_wilson',
      email: 'alex@example.com',
      password,
      bio: 'Building the future, one line at a time 🚀',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
  })

  const emily = await prisma.user.create({
    data: {
      username: 'emily_davis',
      email: 'emily@example.com',
      password,
      bio: 'Photographer | Traveler | Dreamer 🌍',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
  })

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      content: 'Just shipped my first Next.js app with Server Actions! The developer experience is absolutely incredible. 🚀 #NextJS #React',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600',
      authorId: john.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      content: 'Redesigned my portfolio using Framer Motion. The animations are buttery smooth! ✨ #React #TailwindCSS',
      imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600',
      authorId: jane.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      content: 'Just finished reading "The Pragmatic Programmer". Every developer should read this. 📚 #Programming',
      authorId: alex.id,
    },
  })

  const post4 = await prisma.post.create({
    data: {
      content: 'Sunset in Santorini. Nothing beats this view. 🌅 #Travel #Photography',
      imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600',
      authorId: emily.id,
    },
  })

  const post5 = await prisma.post.create({
    data: {
      content: 'MongoDB + Prisma is such a great combo for rapid development. #MongoDB #Prisma #FullStack',
      authorId: john.id,
    },
  })

  // Likes
  await prisma.like.createMany({
    data: [
      { userId: jane.id, postId: post1.id },
      { userId: alex.id, postId: post1.id },
      { userId: john.id, postId: post2.id },
      { userId: alex.id, postId: post2.id },
      { userId: emily.id, postId: post2.id },
      { userId: john.id, postId: post4.id },
      { userId: jane.id, postId: post4.id },
      { userId: emily.id, postId: post3.id },
      { userId: jane.id, postId: post5.id },
    ],
  })

  // Comments
  await prisma.comment.createMany({
    data: [
      { content: 'Congrats! Server Actions are a game-changer!', authorId: jane.id, postId: post1.id },
      { content: 'I need to try this. Is it better than tRPC?', authorId: alex.id, postId: post1.id },
      { content: 'Share the link! I need design inspiration.', authorId: emily.id, postId: post2.id },
      { content: 'Absolutely stunning! When did you go?', authorId: john.id, postId: post4.id },
      { content: 'This combo saved me so much time too!', authorId: alex.id, postId: post5.id },
    ],
  })

  // Follows
  await prisma.follow.createMany({
    data: [
      { followerId: john.id, followingId: jane.id },
      { followerId: john.id, followingId: alex.id },
      { followerId: jane.id, followingId: john.id },
      { followerId: jane.id, followingId: emily.id },
      { followerId: alex.id, followingId: john.id },
      { followerId: emily.id, followingId: jane.id },
    ],
  })

  console.log('✅ Seed complete!')
  console.log('👤 Users created: john_doe, jane_smith, alex_wilson, emily_davis')
  console.log('🔑 Password for all users: password123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
