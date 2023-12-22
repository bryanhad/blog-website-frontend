import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { Comment } from '@/models/comment'
import { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { AuthModalsContext } from '@/app/providers/AuthModalsProvider'
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
    showCancel?: boolean
    onCancel?: () => void
    defaultText?: string
}

export default function CreateCommentBox({
    blogPostId,
    title,
    parentCommentId,
    onCommentCreated,
    showCancel,
    onCancel,
    defaultText,
}: CreateCommentBoxProps) {
    const { user } = useAuthenticatedUser()
    const { showLoginModal } = useContext(AuthModalsContext)

    const {
        register,
        formState: { isSubmitting }, //we don't need the erros cuz we won't show em anyways
        handleSubmit,
        reset, //this will allow us to reset the input field to make it empty again after the user comments
        setFocus,
    } = useForm<createCommentInput>({
        defaultValues: { text: defaultText || '' }, //set default value to the text field if the defaultText is passed that is.. it is optional.. mainly for when opening the createComment box to reply to another comment.. we will set a default value of the parent comment's username
        resolver: yupResolver(valdiationSchema),
    })

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

    useEffect(() => {
        if (parentCommentId) {
            //if this create box is a reply to a parent comment, when rendered, set the focus to the input field
            setFocus('text')
        }
    }, [parentCommentId, setFocus])

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
                {showCancel && (
                    <Button
                        onClick={onCancel}
                        className="ms-2"
                        variant="outline-primary"
                    >
                        Cancel
                    </Button>
                )}
            </Form>
        </div>
    )
}
