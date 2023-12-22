'use client'

import ConfirmationModal from '@/components/ConfirmationModal'
import LoadingButton from '@/components/LoadingButton'
import FormInputField from '@/components/form/FormInputField'
import MarkdownEditor from '@/components/form/MarkdownEditor'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { BlogPost } from '@/models/blog-post.model'
import * as BlogApi from '@/network/api/blog'
import { generateSlug } from '@/utils/utils'
import { requiredStringSchema, slugSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

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

    const [isSubmitting, setIsSubmitting] = useState(false)

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const {
        register,
        formState: { errors },
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
        setIsSubmitting(true)
        try {
            await BlogApi.UpdateBlogPost(blog._id, {
                ...inputs,
                blogImage: blogImage?.item(0) || undefined, //get the first index of the fileList of field blogImage
            })
            router.refresh()
            router.push('/blog/' + inputs.slug)
        } catch (err) {
            setIsSubmitting(false)
            console.error(err)
            alert(err)
        }
    }

    async function onDeleteConfirmed() {
        setShowDeleteModal(false)
        setDeleteLoading(true)
        try {
            await BlogApi.deleteBlog(blog._id)
            router.refresh()
            router.push('/blog')
        } catch (err) {
            setDeleteLoading(false)
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
            {user && (
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
                    <div className="d-flex justify-content-between">
                        <LoadingButton
                            isLoading={isSubmitting}
                            type="submit"
                            disabled={deleteLoading}
                        >
                            Update Post
                        </LoadingButton>
                        <Button
                            disabled={deleteLoading}
                            variant="outline-danger"
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Delete Blog
                        </Button>
                    </div>
                </Form>
            )}
            <ConfirmationModal
                show={showDeleteModal}
                title="Confirm Delete"
                message="Are you sure you want to delete this blog?"
                confirmButtonText="Delete"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={onDeleteConfirmed}
                variant="danger"
            />
        </div>
    )
}
