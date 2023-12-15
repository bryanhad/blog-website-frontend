import { Button, Form } from 'react-bootstrap'
import type { CreateBlogPostValues } from '@/models/blog-post'
import { useForm } from 'react-hook-form'
import * as BlogApi from '@/network/api/blog'
import FormInputField from '@/components/FormInputField'

export default function CreateBlogPostPage() {
    const { register, handleSubmit, formState: {errors} } = useForm<CreateBlogPostValues>(
        {}
    )
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
                <FormInputField
                    label="Post Title"
                    register={register('title', { required: 'Required' })} // will not submit if is not filled! will auto focus to the input field instead! nice,  the mesage will be put to the react-hook-form's form state.
                    placeholder="Post Title"
                    maxLength={100}
                    error={errors.title}
                />
                <FormInputField
                    label="Post Slug"
                    register={register('slug', { required: 'Required' })}
                    placeholder="Post Slug"
                    maxLength={100}
                    error={errors.slug}
                />
                <FormInputField
                    label="Post Summary"
                    register={register('summary', { required: 'Required' })}
                    placeholder="Post Summary"
                    maxLength={300}
                    as="textarea"
                    error={errors.summary}
                />
                <Form.Group className="mb-3" controlId="body-input">
                    <Form.Label>Post Body</Form.Label>
                    <Form.Control
                        {...register('body', { required: 'Required' })}
                        placeholder="Post body.."
                        as="textarea"
                    />
                </Form.Group>
                <Button type="submit">Create Post</Button>
            </Form>
        </div>
    )
}
