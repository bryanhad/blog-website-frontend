import { Col, Row } from '@/components/Bootstrap'
import BlogPostCard from './BlogPostCard'
import { BlogPost } from '@/models/blog-post.model'
import styles from './BlogPostGrid.module.css'

type BlogPostGridProps = {
    posts: BlogPost[]
}

export default function BlogPostsGrid({ posts }: BlogPostGridProps) {
    return (
        <Row xs={1} sm={2} lg={3} className="g-4">
            {posts.map((post) => (
                <Col key={post._id}>
                    <BlogPostCard post={post} className={styles.card} />
                </Col>
            ))}
        </Row>
    )
}
