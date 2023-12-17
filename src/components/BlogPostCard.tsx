import { BlogPost } from '@/models/blog-post.model'
import { formatDate } from '@/utils/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from 'react-bootstrap'

type BlogPostCardProps = {
    post: BlogPost
    className?: string
}

export default function BlogPostCard({
    post: { slug, title, summary, blogImage, createdAt },
    className,
}: BlogPostCardProps) {
    const postLink = '/blog/' + slug

    return (
        <Card className={className}>
            <article>
                <Link href={postLink}>
                    <Image
                        src={blogImage}
                        alt="Blog post image"
                        width={550} //we set the width to the widest point that the image can render at..
                        height={200}
                        className="card-img-top object-fit-cover"
                    />
                </Link>
                <Card.Body>
                    <Card.Title>
                        <Link href={postLink}>{title}</Link>
                    </Card.Title>
                    <Card.Text>{summary}</Card.Text>
                    <Card.Text className="text-muted small">
                        {/* use time html tag for better SEO and crawler would be happy! */}
                        {/* this helps crawler to understand more about ur date stuffs */}
                        <time dateTime={createdAt}>
                            {formatDate(createdAt)}
                        </time>
                    </Card.Text>
                </Card.Body>
            </article>
        </Card>
    )
}
