import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { Comment } from '@/models/comment'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { AuthModalsContext } from '../auth/AuthModalsProvider'
import { yupResolver } from '@hookform/resolvers/yup'
import * as BlogApi from '@/network/api/blog'
import { Button, Form } from 'react-bootstrap'
import FormInputField from '../form/FormInputField'
import LoadingButton from '../LoadingButton'

const valdiationSchema = yup.object({
    text: yup.string(),
})

type createCommentInput = yup.InferType<typeof valdiationSchema>

type CreateCommentBoxProps = {
    blogPostId: string //we need to know which blog does this createCommentBox belongs to
    parentCommentId?: string //we only pass this prop if this createCommentBox component is for replying existing comments
    title: string
    onCommentCreated: (comment: Comment) => void
}

export default function CreateCommentBox({
    blogPostId,
    title,
    parentCommentId,
    onCommentCreated,
}: CreateCommentBoxProps) {
    const { user } = useAuthenticatedUser()
    const { showLoginModal } = useContext(AuthModalsContext)

    const {
        register,
        formState: { isSubmitting }, //we don't need the erros cuz we won't show em anyways
        handleSubmit,
        reset, //this will allow us to reset the input field to make it empty again after the user comments
    } = useForm<createCommentInput>({ resolver: yupResolver(valdiationSchema) })

    async function onSubmit({ text }: createCommentInput) {
        if (!text) return //this is why we don't need to get the errors or even bother to setup required error message. cuz the user probably knows that the have to fill in the input field to comment lel

        try {
            const createdComment = await BlogApi.createComment(
                blogPostId,
                text,
                parentCommentId
            )
            onCommentCreated(createdComment)
            reset() //resets the form
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    if (!user) {
        return (
            <Button
                onClick={showLoginModal}
                variant="outline-primary"
                className="mt-1"
            >
                Log in to write a comment
            </Button>
        )
    }

    return (
        <div className="mt-2">
            <div className="mb-1">{title}</div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    register={register('text')}
                    as="textarea"
                    maxLength={700} //this is the same as the validation on the backend!
                    placeholder="Pour your hearts out..."
                />
                <LoadingButton type="submit" isLoading={isSubmitting}>
                    Send
                </LoadingButton>
            </Form>
        </div>
    )
}
