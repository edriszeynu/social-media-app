// lib/types.ts
export interface User {
  id: string
  username: string
  email: string
  avatar: string | null
  bio: string | null
}

export interface Post {
  id: string
  content: string
  imageUrl: string | null
  createdAt: string
  author: {
    id: string
    username: string
    avatar: string | null
  }
  likes: string[] // array of user IDs
  comments: {
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      username: string
      avatar: string | null
    }
  }[]
  isLiked: boolean
  likesCount: number
}