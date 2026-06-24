// lib/dummy-data.ts

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
}

export const users: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Full-stack developer | Coffee addict ☕",
  },
  {
    id: "2",
    username: "jane_smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    bio: "UX Designer & Dog lover 🐕",
  },
  {
    id: "3",
    username: "alex_wilson",
    email: "alex@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    bio: "Building the future, one line at a time 🚀",
  },
  {
    id: "4",
    username: "emily_davis",
    email: "emily@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Photographer | Traveler | Dreamer 🌍",
  },
];

export const dummyPosts: Post[] = [
  {
    id: "p1",
    author: users[0],
    content:
      "Just shipped my first Next.js 14 app with Server Actions! The developer experience is absolutely incredible. 🚀",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600",
    createdAt: "2026-06-24T10:30:00Z",
    likes: ["2", "3"],
    comments: [
      {
        id: "c1",
        author: users[1],
        content: "Congrats, John! Server Actions are a game-changer!",
        createdAt: "2026-06-24T10:45:00Z",
      },
      {
        id: "c2",
        author: users[2],
        content: "I need to try this. Is it better than tRPC?",
        createdAt: "2026-06-24T11:00:00Z",
      },
    ],
  },
  {
    id: "p2",
    author: users[1],
    content:
      "Redesigned my portfolio using Framer Motion. The animations are buttery smooth! ✨",
    imageUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600",
    createdAt: "2026-06-23T15:20:00Z",
    likes: ["1", "3", "4"],
    comments: [
      {
        id: "c3",
        author: users[3],
        content: "Share the link! I need design inspiration.",
        createdAt: "2026-06-23T16:00:00Z",
      },
    ],
  },
  {
    id: "p3",
    author: users[2],
    content:
      "Just finished reading 'The Pragmatic Programmer'. Every developer should read this. 📚",
    createdAt: "2026-06-22T09:00:00Z",
    likes: ["1", "4"],
    comments: [],
  },
  {
    id: "p4",
    author: users[3],
    content:
      "Sunset in Santorini. Nothing beats this view. 🌅",
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600",
    createdAt: "2026-06-21T18:30:00Z",
    likes: ["1", "2"],
    comments: [
      {
        id: "c4",
        author: users[0],
        content: "Absolutely stunning! When did you go?",
        createdAt: "2026-06-21T19:00:00Z",
      },
    ],
  },
];

export const currentUser: User = users[0];

export const getPostById = (id: string) => dummyPosts.find((p) => p.id === id);

export const getUserByUsername = (username: string) =>
  users.find((u) => u.username === username);