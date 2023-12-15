import { Button, Form } from 'react-bootstrap'
import type { CreateBlogPostValues } from '@/models/blog-post'
import { useForm } from 'react-hook-form'
import * as BlogApi from '@/network/api/blog'

export default function CreateBlogPostPage() {
    const { register, handleSubmit } = useForm<CreateBlogPostValues>({})
    // to use useformhook, first, we have to register all input fields.. it's simply just spreading the props..
    // then use pass our own onSubmit function to the handleSubmit, and pass that into onSubmit attr of the form..

    async function onSubmit(input: CreateBlogPostValues) {
        try {
            const newBlog = await BlogApi.createBlogPost(input)
            alert('Post created successfuly')
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    return (
        <div>
            <h1>Create blog page!</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {/* cnotrolId takes care of linking between lavel and the input */}
                <Form.Group className="mb-3" controlId="title-input">
                    <Form.Label>Post Title</Form.Label>
                    <Form.Control
                        {...register('title')}
                        placeholder="Post title.."
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="slug-input">
                    <Form.Label>Post Slug</Form.Label>
                    <Form.Control
                        {...register('slug')}
                        placeholder="Post slug.."
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="summary-input">
                    <Form.Label>Post Summary</Form.Label>
                    <Form.Control
                        {...register('summary')}
                        placeholder="Post summary.."
                        as="textarea"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="body-input">
                    <Form.Label>Post Body</Form.Label>
                    <Form.Control
                        {...register('body')}
                        placeholder="Post body.."
                        as="textarea"
                    />
                </Form.Group>
                <Button type="submit">Create Post</Button>
            </Form>
        </div>
    )
}
