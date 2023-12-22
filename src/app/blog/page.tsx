import { Metadata } from 'next'
import * as BlogApi from '@/network/api/blog'
import BlogPostsGrid from '@/components/blog/BlogPostsGrid'
import { stringify } from 'querystring'
import BlogPaginationBar from './BlogPaginationBar'
import { redirect } from 'next/navigation'

// This page is automatically dynamically rendered cuz we use searchParams
// to force a page to dynamically rener, usually we use: export const dynamic = 'force-dynamic'
// it seems doesn't work on my end tho.. the automatic tinghy.. so I decided to use the manual route

// export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Blogs | Portfolio',
    description: `Read the latest blogs on Bryan Hadinata's portfolio page`,
}

type BlogsPageProps = {
    searchParams: { page?: string } //when we use the searchParams prop, in our react Server Component page, this page is automatically DYNAMICALLY RENDERED! so it will be updated on each request! not just using the cached data at compile time
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
    const page = Number(searchParams.page?.toString() || '1')

    if (page < 1) {
        searchParams.page = '1'
        redirect('/blog?' + stringify(searchParams)) //autmaticaly formats the query object to a url query format
    }

    const {
        blogPosts,
        page: currentPage,
        totalPages,
    } = await BlogApi.getBlogPosts(page)
    
    // we check if the totalPages even exists, cuz if the total page is 0, we would be stuck in an infinite oop
    if (totalPages > 0 && page > totalPages) {
        searchParams.page = totalPages.toString()
        redirect('/blog?' + stringify(searchParams))
    }
    
    return (
        <>
            <div>
                <h1>Blog</h1>
                {blogPosts.length > 0 && <BlogPostsGrid posts={blogPosts} />}
                <div className="d-flex flex-column align-items-center">
                    {blogPosts.length === 0 && <p>No blog posts found</p>}
                    {blogPosts.length > 0 && (
                        <BlogPaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
