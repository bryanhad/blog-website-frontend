import { BlogPost } from '@/models/blog-post.model'
import { NotFoundError } from '@/network/http-errors'
import { notFound } from 'next/navigation'
import * as BlogApi from '@/network/api/blog'
import EditBlogPage from './EditBlogPostPage'

export const dynamic = 'force-dynamic' //force dynamic render.. where eachtime opening this page would fetch the newest data to the db

type PageProps = {
    params: { slug: string }
}

export default async function Page({ params: { slug } }: PageProps) {
    let blog: BlogPost

    try {
        blog = await BlogApi.getBlogPostBySlug(slug)
    } catch (err) {
        if (err instanceof NotFoundError) {
            notFound()
        } else {
            throw err
        }
    }

    return <EditBlogPage blog={blog} />
}