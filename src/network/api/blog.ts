import api from '@/network/axiosInstance'
import { BlogPost } from '@/models/blog-post'

type CreateBlogValues = {
    slug: string
    title: string
    summary: string
    body: string
    blogImage: File
}

export async function getBlogPost() {
    const res = await api.get<BlogPost[]>('/posts')
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
