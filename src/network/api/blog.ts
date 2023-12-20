import api from '@/network/axiosInstance'
import { BlogPost, BlogPostsPage } from '@/models/blog-post.model'
import { Comment, GetCommentsResponse } from '@/models/comment'

type CreateBlogValues = {
    slug: string
    title: string
    summary: string
    body: string
    blogImage: File
}

export async function getBlogPost(page: number = 1) {
    const res = await api.get<BlogPostsPage>('/posts?page=' + page)
    return res.data
}

export async function getBlogPostByUser(userId: string, page: number = 1) {
    const res = await api.get<BlogPostsPage>(
        `/posts?authorId=${userId}&page=${page}`
    )
    return res.data
}

export async function getBlogPostSlugs() {
    const res = await api.get<string[]>('/posts/slugs')
    return res.data
}

export async function getBlogPostBySlug(slug: string) {
    const res = await api.get<BlogPost>(`/posts/post/${slug}`)
    return res.data
}

export async function createBlogPost(input: CreateBlogValues) {
    // we cannot pass the file type as a JSON! we must send it as a formData type
    const formData = new FormData() //formData supports file type!
    Object.entries(input).forEach(([key, value]) => {
        formData.append(key, value)
    })

    const res = await api.post<BlogPost>('/posts', formData)
    return res.data
}

type UpdateBlogPostValues = {
    slug: string
    title: string
    summary: string
    body: string
    blogImage?: File
}

export async function UpdateBlogPost(
    blogId: string,
    input: UpdateBlogPostValues
) {
    const formData = new FormData() //formData supports file type!
    Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) {
            //cuz if the blogImage's value is undefined, we don't want to append it to the formData
            formData.append(key, value)
        }
    })

    await api.patch(`/posts/${blogId}`, formData)
}

export async function deleteBlog(blogId: string) {
    await api.delete(`/posts/${blogId}`)
}

export async function getBlogComments(
    blogId: string,
    continueAfterId?: string
) {
    const res = await api.get<GetCommentsResponse>(
        `/posts/${blogId}/comments?${
            continueAfterId ? `continueAfterId=${continueAfterId}` : ''
        }`
    )
    return res.data
}

export async function getCommentReplies(
    commentId: string,
    continueAfterId?: string
) {
    const res = await api.get<GetCommentsResponse>(
        `/posts/comments/${commentId}/replies?${
            continueAfterId ? `continueAfterId=${continueAfterId}` : ''
        }`
    )
    return res.data
}

export async function createComment(
    blogId: string,
    text: string,
    parentCommentId: string | undefined //tis way, we will have to be more strict, we will have to pass the parentCommentId argument, either a string or undefined. So we can differentiate between a top level comment vs a nester comment
) {
    const res = await api.post<Comment>(`/posts/${blogId}/comments`, {
        text,
        parentCommentId,
    })
    return res.data
}

export async function updateComment(commentId: string, newText: string) {
    const res = await api.patch<Comment>(`/posts/comments/${commentId}`, {
        newText,
    })
    return res.data
}

export async function deleteComment(commentId: string) {
   await api.delete(`/posts/comments/${commentId}`)
   
} 
