import { Comment as CommentModel } from '@/models/comment'
import { useCallback, useEffect, useState } from 'react'
import * as BlogApi from '@/network/api/blog'
import CreateCommentBox from './CreateCommentBox'
import Comment from './Comment'
import { Button, Spinner } from 'react-bootstrap'

type BlogCommentSectionProps = {
    blogId: string
}

export default function BlogCommentSection({
    blogId,
}: BlogCommentSectionProps) {
    //when we navigate from one blog post to another, we want to reset the whole comment section's initial state!
    return <CommentSection blogId={blogId} key={blogId} />
}

function CommentSection({ blogId }: BlogCommentSectionProps) {
    const [comments, setComments] = useState<CommentModel[]>([])
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [commentsLoadingIsError, setCommentsLoadingIsError] = useState(false)

    const [commentsPaginationEnd, setCommentsPaginationEnd] =
        useState<boolean>() // we want to keep the initialState to be undefined, cuz we don;t know wether the comment has more or no pagination when the data itself hasn't been fetched

    const loadNextComments = useCallback(
        async (continueAfterId?: string) => {
            //wrapping the function in useCallback, makes that this function won't be rerenderd when the component rerenders.. if we don't wrap it in useCallback..
            //when the component first renders, the useEffect would fire, and that would fire this function and that would result in rerender of this component, and THAT.. would result in the redeclare of this function, and that would trigger the useEffect's deppendency.. and so on.. and so on.. util everyone dies..
            setCommentsLoading(true)
            setCommentsLoadingIsError(false)
            try {
                const res = await BlogApi.getComments(blogId, continueAfterId)
                if (!continueAfterId) {
                    // if there is no continue afterId, we must be loading the first comments!
                    setComments(res.comments)
                } else {
                    setComments((prev) => [...prev, ...res.comments]) //set a new array to the state that has the spread of prev comments state and the new comments that is from the fetch
                }
                setCommentsPaginationEnd(res.endOfPaginationReached) //now we know the state of if there is next pagination or not. either true or false
            } catch (err) {
                console.error(err)
                setCommentsLoadingIsError(true)
            } finally {
                setCommentsLoading(false)
            }
        },
        [blogId]
    )

    useEffect(() => {
        loadNextComments()
    }, [loadNextComments])

    //we can't use useSWR hook for this..
    ///ep 33 hour 1

    function handleCommentCreated(newComment: CommentModel) {
        setComments([newComment, ...comments]) //we append the new comment to the first of the array of comments
    }

    return (
        <div>
            <p className="h5">Comments</p>
            <CreateCommentBox
                blogPostId={blogId}
                title="Write a comment"
                onCommentCreated={handleCommentCreated}
            />
            {comments.map((comment) => (
                <Comment comment={comment} key={comment._id} />
            ))}
            <div className="mt-2 text-center">
                {commentsPaginationEnd &&
                    comments.length === 0 && ( // if there is no pagination and the comment's length is 0
                        <p>N one has posted a comment. Be the first!</p>
                    )}
                {commentsLoading && <Spinner animation="border" />}
                {!commentsLoading &&
                    !commentsPaginationEnd && ( //if not loading and we haven't reached the end of the pagination comment
                        <Button
                            variant="outline-primary"
                            onClick={() =>
                                loadNextComments(
                                    comments[comments.length - 1]?._id //get the last Id of the last comment
                                )
                            }
                        >
                            Show more comments
                        </Button>
                    )}
                {commentsLoadingIsError && <p>Comments could not be loaded</p>}
            </div>
        </div>
    )
}
