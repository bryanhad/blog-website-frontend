import { User } from "./user.model"

export type BlogPost = {
    _id: string

    slug: string
    title: string
    summary: string
    body: string
    blogImage: string
    author: User

    createdAt: string
    updatedAt: string
}

export type BlogPostsPage = {
    blogPosts: BlogPost[]
    page: number
    totalPages: number
}