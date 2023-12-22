'use client'

import { User } from '@/models/user.model'
import { useState } from 'react'
import useSWR from 'swr'
import * as BlogAPi from '@/network/api/blog'
import BlogPostsGrid from '@/components/blog/BlogPostsGrid'
import PaginationBar from '@/components/PaginationBar'
import { Spinner } from '@/components/Bootstrap'

type UserBlogsSectionProps = {
    user: User
}

export default function UserBlogsSection({ user }: UserBlogsSectionProps) {
    //client side pagination, u can use state!

    const [page, setPage] = useState(1)

    const {
        data,
        isLoading: blogPostsLoading,
        error: BlogPostsLoadingError,
    } = useSWR(
        [user._id, page, 'user_posts'], //we can pass multiple params as the cache key! these would be passed into the fetcher function
        //we need all the unique keys that is associated wit the function that we are going to make, to make sure there are no cache clashes!
        // for example, if u only pass in the user._id as the unique cache key for this cache, and just pass the page param to the fetcher callback, you would still get the cached value from the first call, cuz both calls has the same cache key!
        ([userId, pageNum]) => BlogAPi.getBlogPostByUser(userId, pageNum)
    )
    //the key would be forwarded to the function callback!

    const blogPosts = data?.blogPosts || []
    const totalPages = data?.totalPages || 0

    return (
        <div>
            <hr />
            <h2>Blog Posts</h2>
            {blogPosts.length > 0 && <BlogPostsGrid posts={blogPosts} />}
            <div className="d-flex flex-column align-items-center">
                {blogPostsLoading && <Spinner animation="border" />}

                {BlogPostsLoadingError && <p>Blog posts could not be loaded</p>}

                {!blogPostsLoading &&
                    !BlogPostsLoadingError &&
                    blogPosts.length === 0 && (
                        <p>This user hasn&apos;t posted anything yet</p>
                    )}

                {blogPosts.length > 0 && (
                    <PaginationBar
                        currentPage={page}
                        pageCount={totalPages}
                        onPageItemClicked={(pageNum) => setPage(pageNum)}
                        className="mt-4"
                    />
                )}
            </div>
        </div>
    )
}
