import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { Comment } from '@/models/comment'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import * as BlogApi from '@/network/api/blog'
import { Button, Form } from 'react-bootstrap'
import FormInputField from '../form/FormInputField'
import LoadingButton from '../LoadingButton'
import { useEffect } from 'react'

const valdiationSchema = yup.object({
    text: yup.string(),
})

type EditCommentBoxInput = yup.InferType<typeof valdiationSchema>

type EditCommentBoxProps = {
    comment: Comment
    onCommentUpdated: (updatedComment: Comment) => void
    onCancel: () => void
}

export default function EditCommentBox({
    comment,
    onCommentUpdated,
    onCancel,
}: EditCommentBoxProps) {
    const { user } = useAuthenticatedUser()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        setFocus, //allows us to setFocus to specific input field!
    } = useForm<EditCommentBoxInput>({
        defaultValues: {
            text: comment.text, //pre fill the input field with the comment that is contained inside it
        },
        resolver: yupResolver(valdiationSchema),
    })

    async function onSubmit({ text }: EditCommentBoxInput) {
        if (!text) return

        try {
            const updatedComment = await BlogApi.updateComment(
                comment._id,
                text
            )
            onCommentUpdated(updatedComment)
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    useEffect(() => {
        //this will make sure everytime this component of EDIT COMMENT BOX is rendered, it will set the user's focus to the input field!
        setFocus('text')
    }, [setFocus])

    return (
        <div className="mt-2">
            <div className="mb-1">Edit comment</div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    register={register('text')}
                    as="textarea"
                    maxLength={700} //we set the backend to max length f 700 also!
                />
            <LoadingButton type="submit" isLoading={isSubmitting}>
                Submit
            </LoadingButton>
            <Button
                onClick={onCancel}
                className="ms-2"
                variant="outline-primary"
            >
                Cancel
            </Button>
            </Form>
        </div>
    )
}
