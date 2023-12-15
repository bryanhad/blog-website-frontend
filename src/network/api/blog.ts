import api from '@/network/axiosInstance'
import { BlogPost, CreateBlogPostValues } from "@/models/blog-post";

export async function createBlogPost(input:CreateBlogPostValues) {
    const res = await api.post<BlogPost>('/posts', input)
    return res.data
}