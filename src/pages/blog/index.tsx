import { GetServerSideProps } from 'next'
import Head from 'next/head'
import * as BlogApi from '@/network/api/blog'
import { BlogPost } from '@/models/blog-post'
import BlogPostCard from '@/components/BlogPostCard'
import { Col, Row } from 'react-bootstrap'
import BlogPostsGrid from '@/components/BlogPostsGrid'

// getServerSideProps only works in nextjs pages dir, and is only for pages, not components.
export const getServerSideProps: GetServerSideProps<
    BlogPageProps
> = async () => {
    const posts = await BlogApi.getBlogPost()
    return { props: { posts } } //basiaclly we will get the return of this call to the page's props
}

type BlogPageProps = {
    posts: BlogPost[]
}

export default function BlogsPage({ posts }: BlogPageProps) {
    return (
        <>
            <Head>
                <title>Blogs | Portfolio</title>
                <meta
                    name="description"
                    content="Read the latest blogs on Bryan Hadinata's portfolio page"
                />
            </Head>
            <div>
                <h1>Blog</h1>
                <BlogPostsGrid posts={posts} />
            </div>
        </>
    )
}
