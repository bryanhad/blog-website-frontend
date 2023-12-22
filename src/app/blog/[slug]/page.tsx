// in app router, the param is accessible through the params prop! it only is accessible when on a specific pages: like 'layout', 'page', or 'route'. and also 'generateMetadata' functions!

import UserProfileLink from '@/components/UserProfileLink'
import BlogCommentSection from '@/components/comments/BlogCommentSection'
import RenderMarkdown from '@/components/markdown/RenderMarkdown'
import * as BlogApi from '@/network/api/blog'
import { NotFoundError } from '@/network/http-errors'
import { formatDate } from '@/utils/utils'
import { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import styles from './BlogPostPage.module.css'
import EditPostButton from './EditPostButton'

// This page is statically rendered and only updates after manual revalidation!

type BlogPostPageProps = {
    params: { slug: string }
}

export async function generateMetadata({
    params: { slug },
}: BlogPostPageProps): Promise<Metadata> {
    const blogPost = await getPost(slug)
    return {
        title: `${blogPost.title} - Bryan Hadinata`,
        description: blogPost.summary,
        openGraph: {
            images: [{ url: blogPost.blogImage }],
        },
    }
}

// getStaticParams is better for SEO,
// cuz it will fetch and make the HTML and fill it with the data at compile time! so it will just serve it like instantly! WOAW! :O
// but there's a catch!
// what if there's a new blog that has been created after the compile time?
// well next js app router is already smarth enough..
// the new blogpost would be compiled when the first user opens the newly created blog, and cache it for further use

export async function generateStaticParams() {
    const slugs = await BlogApi.getBlogPostSlugs()
    return slugs.map((slug) => ({ slug })) //we must return an array of object! the key is the param, and ofc the value is well, the param's value
}

const getPost = (slug: string) =>
    unstable_cache(
        async function (slug: string) {
            //this will deduplicate this function, but only for 1 render cycle
            // that means, on the first render each component on this page that uses this function, would use the same value with only 1 fetch..
            // but when u refresh the page for exaample, this func will fire again like usual
            try {
                return await BlogApi.getBlogPostBySlug(slug)
            } catch (err) {
                if (err instanceof NotFoundError) {
                    //if the error is notfound, go to notfound page! not the error page
                    notFound()
                } else {
                    throw err
                }
            }
        },
        [slug],
        { tags: [slug] }
    )(slug)

export default async function BlogPostPage({
    params: { slug },
}: BlogPostPageProps) {
    const {
        _id,
        title,
        summary,
        body,
        blogImage,
        author,
        createdAt,
        updatedAt,
    } = await getPost(slug)

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
        <div className={styles.container}>
            <EditPostButton authorId={author._id} slug={slug} />

            <div className="text-center mb-4">
                <Link href="/blog">Blog Home</Link>
            </div>

            <article>
                <div className="d-flex flex-column align-items-center">
                    <h1 className="text-center mb-3">{title}</h1>
                    <p className="text-center mb-3 h5">{summary}</p>
                    <p className="d-flex gap-2 align-items-center">
                        posted by <UserProfileLink user={author} />
                    </p>

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
                <div>
                    <RenderMarkdown>{body}</RenderMarkdown>
                </div>
            </article>
            <hr />
            <BlogCommentSection blogId={_id} />
        </div>
    )
}
