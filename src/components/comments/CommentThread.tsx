import { Comment as CommentModel } from '@/models/comment'
import { useState } from 'react'
import * as BlogApi from '@/network/api/blog'
import Comment from './Comment'
import { Button, Spinner } from 'react-bootstrap'

type CommentThreadProps = {
    comment: CommentModel
    onCommentUpdated: (updatedComment: CommentModel) => void //we need to do this cuz the parent is the one who holds the current comment state!
    onCommentDeleted: (deletedComment: CommentModel) => void
}

export default function CommentThread({
    comment,
    onCommentDeleted,
    onCommentUpdated,
}: CommentThreadProps) {
    const [replies, setReplies] = useState<CommentModel[]>([])
    const [repliesLoading, setRepliesLoading] = useState(false)
    const [repliesLoadingIsError, setRepliesLoadingIsError] = useState(false)

    const [repliesPaginationEndReached, setRepliesPaginationEndReached] =
        useState<boolean>() // we want to keep the initialState to be undefined, cuz we don;t know wether the comment has more or no pagination when the data itself hasn't been fetched

    const [localReplies, setLocalReplies] = useState<CommentModel[]>([])

    async function loadNextReplies() {
        const continueAfterId = replies[replies.length - 1]?._id // we use safe call cuz the array of replies can be empty
        setRepliesLoading(true)
        setRepliesLoadingIsError(false)

        try {
            const res = await BlogApi.getCommentReplies(
                comment._id,
                continueAfterId
            )
            setReplies([...replies, ...res.comments]) //add the replies to the end of the array of replies
            setRepliesPaginationEndReached(res.endOfPaginationReached)
            setLocalReplies([]) //when we click load more, the local replies would be removed.. cuz essentially our reply should be the newest reply, and our replies is going to show the oldest from the top!
        } catch (err) {
            console.error(err)
            setRepliesLoadingIsError(true)
        } finally {
            setRepliesLoading(false)
        }
    }

    function handleReplyCreated(newReply: CommentModel) {
        setLocalReplies([...localReplies, newReply]) //spread the previous state of local replies, and just append our newReply to the end of the local replies.. this will be shown below the loadmore button
    }

    function handleRemoteReplyUpdated(updatedReply: CommentModel) {
        const updatedReplies = replies.map((existingReply) =>
            existingReply._id === updatedReply._id
                ? updatedReply // we don't have 2 level deep reply.. so we can just return the updated reply as is
                : existingReply
        )
        setReplies(updatedReplies) //update it
    }

    function handleRemoteReplyDeleted(deletedReply: CommentModel) {
        const updatedReplies = replies.filter(
            (reply) => reply._id !== deletedReply._id
        )
        setReplies(updatedReplies)//update it
    }

    function handleLocalReplyUpdated(updatedReply: CommentModel) {
        const updatedReplies = localReplies.map((existingReply) =>
            existingReply._id === updatedReply._id
                ? updatedReply // we don't have 2 level deep reply.. so we can just return the updated reply as is
                : existingReply
        )
        setLocalReplies(updatedReplies) //update the localReplies state
    }

    function handleLocalReplyDeleted(deletedReply: CommentModel) {
        const updatedReplies = localReplies.filter(reply => reply._id !== deletedReply._id)
        setLocalReplies(updatedReplies)//update the localReplies state
    }

    const showLoadRepliesButton = //only show the loadRepliesButton when the repliesCount is truthy, when the replies is not loading, and when the repliesPaginationEndReached hasn't reach it's end
        !!comment.repliesCount &&
        !repliesLoading &&
        !repliesPaginationEndReached //repliesPaginationEndReached would be true

    return (
        <div>
            <Comment
                comment={comment}
                onReplyCreated={handleReplyCreated}
                onCommentUpdated={onCommentUpdated}
                onCommentDeleted={onCommentDeleted}
            />
            {/* REMOTE REPLIES (from server) */}
            <Replies
                replies={replies}
                onReplyCreated={handleReplyCreated}
                onReplyUpdated={handleRemoteReplyUpdated}
                onReplyDeleted={handleRemoteReplyDeleted}
            />
            <div className="mt-2 text-center">
                {repliesLoading && <Spinner animation="border" />}
                {repliesLoadingIsError && <p>Replies could not be loaded.</p>}
                {showLoadRepliesButton && (
                    <Button variant="outline-primary" onClick={loadNextReplies}>
                        {repliesPaginationEndReached === undefined // repliesPaginationEndReached would be undefined for the first time.. it would be boolean when we have already loaded the replies for a particular comment..
                            ? // the repliesPaginationEndReached would be boolean after our first time clicking this Button that triggers loadNextReplies..
                              `Show ${comment.repliesCount} ${
                                  comment.repliesCount === 1
                                      ? 'reply'
                                      : 'replies'
                              }`
                            : 'Show more replies'}
                    </Button>
                )}
            </div>
            {/* LOCAL REPLIES (from user) (new reply)*/}
            <Replies
                replies={localReplies}
                onReplyCreated={handleReplyCreated}
                onReplyUpdated={handleLocalReplyUpdated}
                onReplyDeleted={handleLocalReplyDeleted}
            />
        </div>
    )
}

type RepliesProps = {
    replies: CommentModel[]
    onReplyCreated: (reply: CommentModel) => void //we have to do this btw, cuz the state of the replies lies on the parent! so we have to drill through our callbacks..
    onReplyUpdated: (updatedReply: CommentModel) => void
    onReplyDeleted: (deletedReply: CommentModel) => void
}

function Replies({
    onReplyCreated,
    onReplyDeleted,
    onReplyUpdated,
    replies,
}: RepliesProps) {
    return (
        <div className="ms-5">
            {replies.map((reply) => (
                <Comment
                    comment={reply}
                    key={reply._id}
                    onReplyCreated={onReplyCreated}
                    onCommentUpdated={onReplyUpdated}
                    onCommentDeleted={onReplyDeleted}
                />
            ))}
        </div>
    )
}
