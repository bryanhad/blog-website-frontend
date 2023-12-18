import { GetServerSideProps } from 'next'
import Head from 'next/head'
import * as BlogApi from '@/network/api/blog'
import { BlogPost, BlogPostsPage } from '@/models/blog-post.model'
import BlogPostsGrid from '@/components/BlogPostsGrid'
import { stringify } from 'querystring'
import PaginationBar from '@/components/PaginationBar'
import { useRouter } from 'next/router'

// getServerSideProps only works in nextjs pages dir, and is only for pages, not components.
// it's just a way to fetch the data at request time! so when the user receives the page, the content is already loaded!
// this function is always going to run on each request!
export const getServerSideProps: GetServerSideProps<BlogPageProps> = async ({
    query,
}) => {
    //server side pagination.. u have to store ur page info in the url! cuz that's the only way the server knows whats up
    const page = Number(query.page?.toString() || '1')

    if (page < 1) {
        query.page = '1'
        return {
            redirect: {
                destination: '/blog?' + stringify(query), //autmaticaly formats the query object to a url query format
                permanent: false, //makes it so that the browser won't cache the redirect
            },
        }
    }

    const data = await BlogApi.getBlogPost(page)

    // we check if the totalPages even exists, cuz if the total page is 0, we would be stuck in an infinite oop
    if (data.totalPages > 0 && page > data.totalPages) {
        query.page = data.totalPages.toString()
        return {
            redirect: {
                destination: '/blog?' + stringify(query),
                permanent: false,
            },
        }
    }

    return { props: { data } } //basiaclly we will get the return of this call to the page's props
}

type BlogPageProps = {
    data: BlogPostsPage
}

export default function BlogsPage({
    data: { blogPosts, page, totalPages },
}: BlogPageProps) {
    const router = useRouter()

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
                {blogPosts.length > 0 && <BlogPostsGrid posts={blogPosts} />}
                <div className="d-flex flex-column align-items-center">
                    {blogPosts.length === 0 && <p>No blog posts found</p>}
                    {blogPosts.length > 0 && (
                        <PaginationBar
                            currentPage={page}
                            pageCount={totalPages}
                            onPageItemClicked={(pageNum) => {
                                router.push({query: {...router.query, page:pageNum}})
                            }}
                            className='mt-4'
                        />
                    )}
                </div>
            </div>
        </>
    )
}
