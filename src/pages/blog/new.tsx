import { Button, Form } from 'react-bootstrap'
import type { CreateBlogPostValues } from '@/models/blog-post'
import { useForm } from 'react-hook-form'
import * as BlogApi from '@/network/api/blog'
import FormInputField from '@/components/form/FormInputField'
import MarkdownEditor from '@/components/form/MarkdownEditor'
import { generateSlug } from '@/utils/utils'
import LoadingButton from '@/components/LoadingButton'

export default function CreateBlogPostPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        getValues, //getValues only get the value when it is called.
        watch, //watch is updated in real time
    } = useForm<CreateBlogPostValues>({})
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

    function generateSlugFromTitle() {
        if (getValues('slug')) return
        const slug = generateSlug(getValues('title'))
        setValue('slug', slug, { shouldValidate: true })
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
                    onBlur={generateSlugFromTitle} //attribute from normal input tag! will run the function when the user took off the focus
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
                <MarkdownEditor
                    watch={watch}
                    setValue={setValue}
                    label="Post Body"
                    register={register('body', { required: 'Required' })}
                    error={errors.body}
                />
                <LoadingButton isLoading={isSubmitting} type="submit">
                    Create Post
                </LoadingButton>
            </Form>
        </div>
    )
}
