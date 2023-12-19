// in app router, the param is accessible through the params prop! it only is accessible when on a specific pages: like 'layout', 'page', or 'route'. and also 'generateMetadata' functions!

import { BlogPost } from '@/models/blog-post.model'
import { GetStaticPaths, GetStaticProps } from 'next'
import * as BlogApi from '@/network/api/blog'
import Head from 'next/head'
import styles from '@/styles/BlogPostPage.module.css'
import Link from 'next/link'
import { formatDate } from '@/utils/utils'
import Image from 'next/image'
import { NotFoundError } from '@/network/http-errors'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { FiEdit } from 'react-icons/fi'
import useSWR from 'swr'
import BlogCommentSection from '@/components/comments/BlogCommentSection'

// getStaticProps is better for SEO,
// cuz it will fetch and make the HTML and fill it with the data at build time! so it will just serve it like instantly! WOAW! :O
// but there's a catch!
// the page won't be updated! cuz the data is fetched on built time!

export const getStaticPaths: GetStaticPaths = async () => {
    const slugs = await BlogApi.getBlogPostSlugs()

    const paths = slugs.map((slug) => ({ params: { slug } }))
    return { paths, fallback: 'blocking' } //we can add the fallback:'blocking' to tell nextjs, that if we access a blog slug that is not fetched on the build time, just do it like the good ol getServerSideProps! so it's not going to redirect the user to the notFound page! but next time, it will served statically!
}

type BlogPostPageProps = {
    fallbackPost: BlogPost
}

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
    params,
}) => {
    try {
        const slug = params?.slug?.toString()
        if (!slug) throw Error('missing slug!')

        const blog = await BlogApi.getBlogPostBySlug(slug)
        return { props: { fallbackPost: blog } }
    } catch (err) {
        if (err instanceof NotFoundError) {
            //if the error is notfound, go to notfound page! not the error page
            return { notFound: true }
        } else {
            throw err
        }
    }
}

export default function BlogPostPage({ fallbackPost }: BlogPostPageProps) {
    const { user } = useAuthenticatedUser()

    const { data: blogPost } = useSWR( //this is the uptodate data!
        fallbackPost.slug,
        BlogApi.getBlogPostBySlug, {
            revalidateOnFocus:false //we can turn off revalidation on focus.. just somethings to consider and good to know
            // with this turned off, we must refresh the page to get the updated data.. which is more natural i think lel.. kinda freaky if ur page suddenly updates haha
        }
    )

    const {
        _id,
        slug,
        title,
        summary,
        body,
        blogImage,
        author,
        createdAt,
        updatedAt,
    } = blogPost || fallbackPost //so, when the blogPost fetched by SWR is still undefined, we will use the fallbackPost which is fetched at build time.. which would be a stale data if there's an update

    const createdUpdatedText =
        updatedAt > createdAt ? (
            <>
                updated{' '}
                <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
            </>
        ) : (
            <time dateTime={createdAt}>{formatDate(createdAt)}</time>
        )

    return (
        <>
            <Head>
                <title>{`${title} - Bryan Hadinata`}</title>
                <meta name="description" content={summary} />
            </Head>

            <div className={styles.container}>
                {user?._id === author._id && (
                    <Link
                        href={`/blog/edit/${slug}`}
                        className="btn btn-outline-primary d-inline-flex align-items-center gap-1 mb-2"
                    >
                        <FiEdit />
                        Edit post
                    </Link>
                )}
                <div className="text-center mb-4">
                    <Link href="/blog">Blog Home</Link>
                </div>

                <article>
                    <div className="d-flex flex-column align-items-center">
                        <h1 className="text-center mb-3">{title}</h1>
                        <p className="text-center mb-3 h5">{summary}</p>
                        <span className="text-muted">{createdUpdatedText}</span>
                        <div className={styles.blogImageWrapper}>
                            <Image
                                src={blogImage}
                                alt="Blog post image"
                                fill //when u use fill attribute in nextImage, u will load the image to 100% of the viewport's width.. that is fine for a smaller size screen cuz the image width is probably the max width of the viewport.. but the problem lies in bigger screens! cuz usually the image isn't the same width as the viewport!
                                sizes="(max-width: 768px) 100vw, 700px" // we use at what point do we want to render 100vw size, which refers to the breakpoint size that we set in next.config,, and after 768px screen width, we want to render the image at fixed width of 700px!
                                priority
                                className="rounded"
                            />
                        </div>
                    </div>
                    <div>{body}</div>
                </article>
                <hr />
                <BlogCommentSection blogId={_id}/>
            </div>
        </>
    )
}
