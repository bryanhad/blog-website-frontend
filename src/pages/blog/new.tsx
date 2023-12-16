import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as BlogApi from '@/network/api/blog'
import FormInputField from '@/components/form/FormInputField'
import MarkdownEditor from '@/components/form/MarkdownEditor'
import { generateSlug } from '@/utils/utils'
import LoadingButton from '@/components/LoadingButton'
import { useRouter } from 'next/router'

type CreateBlogFormData = {
    slug: string
    title: string
    summary: string
    body: string
    blogImage: FileList // File list is just the native type of which input type 'file' returns.. an array of files. yeah. even though we only want one file.. :(
}

export default function CreateBlogPostPage() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        getValues, //getValues only get the value when it is called.
        watch, //watch is updated in real time
    } = useForm<CreateBlogFormData>({})
    // to use useformhook, first, we have to register all input fields.. it's simply just spreading the props..
    // then use pass our own onSubmit function to the handleSubmit, and pass that into onSubmit attr of the form..

    async function onSubmit({ blogImage, ...inputs }: CreateBlogFormData) {
        try {
            const newBlog = await BlogApi.createBlogPost({
                ...inputs,
                blogImage: blogImage[0], // we only send the first index cuz that's what the createBlogPost expects.. a single File!
            })
            await router.push('/blog/' + inputs.slug) //we await the router.push so that the formState isSubmitting would still be true while loading the router.push finnish!
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
                <FormInputField
                    label="Post Image"
                    register={register('blogImage', { required: 'Required' })}
                    type="file"
                    accept="image/png,image/jpeg" //this will modify the file type when we click on the choose file input
                    error={errors.blogImage}
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
