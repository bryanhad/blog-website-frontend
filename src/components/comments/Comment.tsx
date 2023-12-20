import { Comment as CommentModel } from '@/models/comment' //rename the Comment cuz it willc lah with the component's anme
import UserProfileLink from '../UserProfileLink'
import { formatDate, formatRelativeDate } from '@/utils/utils'
import EditCommentBox from './EditCommentBox'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { useContext, useState } from 'react'
import { AuthModalsContext } from '../auth/AuthModalsProvider'
import { Button } from 'react-bootstrap'
import CreateCommentBox from './CreateCommentBox'
import { NotFoundError } from '@/network/http-errors'
import * as BlogApi from '@/network/api/blog'

type CommentProps = {
    comment: CommentModel
    onReplyCreated: (reply: CommentModel) => void
    onCommentUpdated: (updatedComment: CommentModel) => void
    onCommentDeleted: (deletedComment: CommentModel) => void
}

export default function Comment({
    comment,
    onCommentDeleted,
    onCommentUpdated,
    onReplyCreated,
}: CommentProps) {
    const { user } = useAuthenticatedUser()

    const { showLoginModal } = useContext(AuthModalsContext)

    const [showEditBox, setShowEditBox] = useState(false)
    const [showReplyBox, setShowReplyBox] = useState(false)

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

    function handleReplyClick() {
        user ? setShowReplyBox(true) : showLoginModal()
    }

    function handleEditClick() {
        setShowEditBox(true)
        setShowDeleteConfirmation(false)
    }

    function handleCommentUpdated(updatedComment: CommentModel) {
        onCommentUpdated(updatedComment)
        setShowEditBox(false)
    }

    function handleReplyCreated(newReply: CommentModel) {
        onReplyCreated(newReply)
        setShowReplyBox(false)
    }

    return (
        <div>
            <hr />
            {showEditBox ? (
                <EditCommentBox
                    comment={comment}
                    onCancel={() => setShowEditBox(false)}
                    onCommentUpdated={handleCommentUpdated}
                />
            ) : (
                <CommentLayout
                    onReplyClicked={handleReplyClick}
                    onEditClicked={handleEditClick}
                    onDeleteClicked={() => setShowDeleteConfirmation(true)}
                    comment={comment}
                />
            )}
            {showReplyBox && (
                <CreateCommentBox
                    blogPostId={comment.blogId}
                    title="Write a reply"
                    onCommentCreated={handleReplyCreated}
                    parentCommentId={comment.parentCommentId ?? comment._id} //if the comment that we are replying has a parentCommentId, it means that it is already a child comment.. we will use that parent commentId (which is the top lebel comment id), to be the nested parent comment id.
                    // this way the nesting is only 1 level deep
                    // if there is NO cparrantCommentId in the comment that we are replying to, it means that we are trying to reply to a top level comment, in that case, just use the commentId for the parentCommentId.
                    showCancel
                    onCancel={() => setShowReplyBox(false)}
                    defaultText={comment.parentCommentId ? `@${comment.author.username} ` : ''} //only add the defaut text of the '@username ' if the replyBox is replying to a comment child, not to a top level comment.
                />
            )}
            {showDeleteConfirmation && (
                <DeleteConfirmation
                    comment={comment}
                    onCommentDeleted={onCommentDeleted}
                    onCancel={() => setShowDeleteConfirmation(false)}
                />
            )}
        </div>
    )
}

type CommentLayoutProps = {
    comment: CommentModel
    onReplyClicked: () => void
    onEditClicked: () => void
    onDeleteClicked: () => void
}

function CommentLayout({
    comment,
    onDeleteClicked,
    onEditClicked,
    onReplyClicked,
}: CommentLayoutProps) {
    const { user } = useAuthenticatedUser()

    const loggedIdUserIsAuthor =
        (user && user._id === comment.author._id) || false

    return (
        <div>
            <div className="mb-2">{comment.text}</div>
            <div className="d-flex align-items-center gap-2">
                <UserProfileLink user={comment.author} />
                {formatRelativeDate(comment.createdAt)}
                {comment.updatedAt > comment.createdAt && ( //if the comment has been edited..
                    <span>(Edited)</span>
                )}
            </div>
            <div className="mt-1 d-flex gap-2">
                <Button
                    variant="link"
                    className="small"
                    onClick={onReplyClicked}
                >
                    Reply
                </Button>
                {loggedIdUserIsAuthor && (
                    <>
                        <Button
                            variant="link"
                            className="small"
                            onClick={onEditClicked}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="link"
                            className="small"
                            onClick={onDeleteClicked}
                        >
                            Delete
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}

type DeleteConfirmationProps = {
    comment: CommentModel
    onCommentDeleted: (comment: CommentModel) => void
    onCancel: () => void
}

function DeleteConfirmation({
    comment,
    onCancel,
    onCommentDeleted,
}: DeleteConfirmationProps) {
    const [deleteInProgress, setDeleteInProgress] = useState(false)

    async function deleteComment() {
        setDeleteInProgress(true)
        try {
            await BlogApi.deleteComment(comment._id)
            onCommentDeleted(comment)
        } catch (err) {
            console.error(err)
            if (err instanceof NotFoundError) {
                // this is for in case we delete the comment in another tab.. like if the user has 2 tabs opened at the same time, and the other tab haven't updated to the new state of the comment.. and the user tried to delete the deleted comment..
                // well let's just handle it just in case..
                onCommentDeleted(comment) //if we encounter this well.. just call the onCommentDeleted since it is not in the db..
            } else {
                alert(err)
            }
        } finally {
            setDeleteInProgress(false)
        }
    }

    return (
        <div>
            <p className="text-danger">
                Are you sure you want to delete this comment?
            </p>
            <Button
                variant="danger"
                onClick={deleteComment}
                disabled={deleteInProgress}
            >
                Delete
            </Button>
            <Button
                variant="outline-primary"
                className="ms-2"
                onClick={onCancel}
            >
                Cancel
            </Button>
        </div>
    )
}
