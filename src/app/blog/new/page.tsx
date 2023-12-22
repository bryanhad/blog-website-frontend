'use client'

import LoadingButton from '@/components/LoadingButton'
import FormInputField from '@/components/form/FormInputField'
import MarkdownEditor from '@/components/form/MarkdownEditor'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import useAutoSave from '@/hooks/useAutoSave'
import * as BlogApi from '@/network/api/blog'
import { generateSlug } from '@/utils/utils'
import {
    requiredFileSchema,
    requiredStringSchema,
    slugSchema,
} from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Form, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const validationSchema = yup.object({
    slug: slugSchema.required('Required'),
    title: requiredStringSchema,
    summary: requiredStringSchema,
    body: requiredStringSchema,
    blogImage: requiredFileSchema,
})

type CreateBlogFormData = yup.InferType<typeof validationSchema>

export default function CreateBlogPostPage() {
    const { user, userLoading } = useAuthenticatedUser()

    const router = useRouter()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues, //getValues only get the value when it is called.
        watch, //watch is updated in real time
        reset
    } = useForm<CreateBlogFormData>({ resolver: yupResolver(validationSchema), })
    // to use useformhook, first, we have to register all input fields.. it's simply just spreading the props..
    // then use pass our own onSubmit function to the handleSubmit, and pass that into onSubmit attr of the form..

    const { getValue: getAutoSavedValue, clearValue: clearAutoSaveValue } =
        useAutoSave('new-blog-input', {
            ...watch(),
            blogImage: undefined, //we must set the blogImage to undefined.. cuz a session storage can't store a type FileList value..
            //sessionStorage can only save text input
        })

    useEffect(() => {
        const autoSavedValue = getAutoSavedValue()
        if (autoSavedValue) {
            reset(autoSavedValue) //set the defaultValues of the form to our autoSavedValue that we get from the session storge..
            // we can't just do the defaultValue set on the useForm.. cuz our useAutoSave hook depends on the initialization of the useForm.
            // it needs the watch() func that we get from the useForm.
        }
    }, [getAutoSavedValue, reset])

    async function onSubmit({ blogImage, ...inputs }: CreateBlogFormData) {
        setIsSubmitting(true)
        try {
            await BlogApi.createBlogPost({
                ...inputs,
                blogImage: blogImage[0], // we only send the first index cuz that's what the createBlogPost expects.. a single File!
            })
            clearAutoSaveValue() //clear the session storage
            router.push('/blog/' + inputs.slug) //we await the router.push so that the formState isSubmitting would still be true while loading the router.push finnish!
        } catch (err) {
            setIsSubmitting(false)
            console.error(err)
            alert(err)
        }
    }

    function generateSlugFromTitle() {
        if (getValues('slug')) return
        const slug = generateSlug(getValues('title'))
        setValue('slug', slug, { shouldValidate: true })
    }

    if (userLoading) {
        return <Spinner animation="border" className="d-block m-auto" />
    }

    if (!userLoading && !user) router.push('/')

    return (
        <div>
            <h1>Create blog</h1>
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
                    Create Post
                </LoadingButton>
            </Form>
        </div>
    )
}
