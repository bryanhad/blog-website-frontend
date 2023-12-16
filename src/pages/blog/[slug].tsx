// in app router, the param is accessible through the params prop! it only is accessible when on a specific pages: like 'layout', 'page', or 'route'. and also 'generateMetadata' functions!

import { BlogPost } from '@/models/blog-post'
import { GetStaticPaths, GetStaticProps } from 'next'
import * as BlogApi from '@/network/api/blog'
import Head from 'next/head'
import styles from '@/styles/BlogPostPage.module.css'
import Link from 'next/link'
import { formatDate } from '@/utils/utils'
import Image from 'next/image'

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
    blog: BlogPost
}

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
    params,
}) => {
    const slug = params?.slug?.toString()
    if (!slug) throw Error('missing slug!')

    const blog = await BlogApi.getBlogPostBySlug(slug)
    return { props: { blog } }
}

export default function BlogPostPage({ blog }: BlogPostPageProps) {
    const createdUpdatedText =
        blog.updatedAt > blog.createdAt ? (
            <>
                updated{' '}
                <time dateTime={blog.updatedAt}>
                    {formatDate(blog.updatedAt)}
                </time>
            </>
        ) : (
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
        )

    return (
        <>
            <Head>
                <title>{`${blog.title} - Bryan Hadinata`}</title>
                <meta name="description" content={blog.summary} />
            </Head>

            <div className={styles.container}>
                <div className="text-center mb-4">
                    <Link href="/blog">Blog Home</Link>
                </div>

                <article>
                    <div className="d-flex flex-column align-items-center">
                        <h1 className="text-center mb-3">{blog.title}</h1>
                        <p className="text-center mb-3 h5">{blog.summary}</p>
                        <span className="text-muted">{createdUpdatedText}</span>
                        <div className={styles.blogImageWrapper}>
                            <Image
                                src={blog.blogImage}
                                alt="Blog post image"
                                fill //when u use fill attribute in nextImage, u will load the image to 100% of the viewport's width.. that is fine for a smaller size screen cuz the image width is probably the max width of the viewport.. but the problem lies in bigger screens! cuz usually the image isn't the same width as the viewport!
                                sizes='(max-width: 768px) 100vw, 700px' // we use at what point do we want to render 100vw size, which refers to the breakpoint size that we set in next.config,, and after 768px screen width, we want to render the image at fixed width of 700px!
                                priority
                                className='rounded'
                            />
                        </div>
                    </div>
                    <div>
                        {blog.body}
                    </div>
                </article>
            </div>
        </>
    )
}
