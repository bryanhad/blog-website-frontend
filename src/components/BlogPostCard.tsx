import { BlogPost } from '@/models/blog-post'
import { formatDate } from '@/utils/utils'
import Link from 'next/link'
import { Card } from 'react-bootstrap'

type BlogPostCardProps = {
    post: BlogPost
    className?: string
}

export default function BlogPostCard({
    post: { slug, title, summary, createdAt },
    className,
}: BlogPostCardProps) {
    const postLink = '/blog/' + slug

    return (
        <Card className={className}>
            <article>
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
