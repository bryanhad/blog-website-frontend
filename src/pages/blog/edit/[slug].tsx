import { BlogPost } from '@/models/blog-post.model'
import { GetServerSideProps } from 'next'
import * as BlogApi from '@/network/api/blog'
import { NotFoundError } from '@/network/http-errors'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { requiredStringSchema, slugSchema } from '@/utils/validation'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Spinner } from 'react-bootstrap'
import FormInputField from '@/components/form/FormInputField'
import MarkdownEditor from '@/components/form/MarkdownEditor'
import LoadingButton from '@/components/LoadingButton'
import { generateSlug } from '@/utils/utils'

export const getServerSideProps: GetServerSideProps<
    EditBlogPageProps
> = async ({ params }) => {
    try {
        const slug = params?.slug?.toString()
        if (!slug) throw Error('missing slug!')

        const blog = await BlogApi.getBlogPostBySlug(slug)
        return { props: { blog } }
    } catch (err) {
        if (err instanceof NotFoundError) {
            return { notFound: true }
        } else {
            throw err
        }
    }
}

type EditBlogPageProps = {
    blog: BlogPost
}

const validationSchema = yup.object({
    slug: slugSchema.required('Required'),
    title: requiredStringSchema,
    summary: requiredStringSchema,
    body: requiredStringSchema,
    blogImage: yup.mixed<FileList>(),
})

type EditPostFormData = yup.InferType<typeof validationSchema>

export default function EditBlogPage({ blog }: EditBlogPageProps) {
    const { user, userLoading } = useAuthenticatedUser()

    const router = useRouter()

    const {
        register,
        formState: { errors, isSubmitting, isDirty },
        handleSubmit,
        setValue,
        getValues,
        watch,
    } = useForm<EditPostFormData>({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            title: blog.title,
            slug: blog.slug,
            summary: blog.summary,
            body: blog.body,
        },
    })

    async function onSubmit({ blogImage, ...inputs }: EditPostFormData) {
        try {
            await BlogApi.UpdateBlogPost(blog._id, {
                ...inputs,
                blogImage: blogImage?.item(0) || undefined, //get the first index of the fileList of field blogImage
            })
            await router.push('/blog/' + inputs.slug) // awaiting the router.push is important so that the form's isSubmitting state would be true until the router.push finished it's execution
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

    
    if (!userLoading && !user) router.push('/')
    
    if (userLoading) {
        return <Spinner animation="border" className="d-block m-auto" />
    }

    return (
        <div>
            <h1>Edit Blog</h1>
            <Form onSubmit={handleSubmit(onSubmit)}>
                {/* cnotrolId takes care of linking between lavel and the input */}
                <FormInputField
                    label="Post Title"
                    register={register('title')} // will not submit if is not filled! will auto focus to the input field instead! nice,  the mesage will be put to the react-hook-form's form state.
                    placeholder="Post Title"
                    maxLength={100}
                    error={errors.title}
                    onBlur={generateSlugFromTitle} //attribute from normal input tag! will run the function when the user took off the focus
                />
                <FormInputField
                    label="Post Slug"
                    register={register('slug')}
                    placeholder="Post Slug"
                    maxLength={100}
                    error={errors.slug}
                />
                <FormInputField
                    label="Post Summary"
                    register={register('summary')}
                    placeholder="Post Summary"
                    maxLength={300}
                    as="textarea"
                    error={errors.summary}
                />
                <FormInputField
                    label="Post Image"
                    register={register('blogImage')}
                    type="file"
                    accept="image/png,image/jpeg" //this will modify the file type when we click on the choose file input
                    error={errors.blogImage}
                />
                <MarkdownEditor
                    watch={watch}
                    setValue={setValue}
                    label="Post Body"
                    register={register('body')}
                    error={errors.body}
                />
                <LoadingButton isLoading={isSubmitting} type="submit">
                    Update Post
                </LoadingButton>
            </Form>
        </div>
    )
}
