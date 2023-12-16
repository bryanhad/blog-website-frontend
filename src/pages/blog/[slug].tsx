// in app router, the param is accessible through the params prop! it only is accessible when on a specific pages: like 'layout', 'page', or 'route'. and also 'generateMetadata' functions!

import { BlogPost } from '@/models/blog-post'
import { GetStaticPaths, GetStaticProps } from 'next'
import * as BlogApi from '@/network/api/blog'

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

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
    const slug = params?.slug?.toString()
    if (!slug) throw Error('missing slug!')

    const blog = await BlogApi.getBlogPostBySlug(slug)
    return { props: { blog } }
}


export default function BlogPostPage({ blog }: BlogPostPageProps) {
    return <div>{JSON.stringify(blog)}</div>
}
