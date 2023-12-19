import { Comment as CommentModel } from '@/models/comment' //rename the Comment cuz it willc lah with the component's anme
import UserProfileLink from '../UserProfileLink'
import { formatDate, formatRelativeDate } from '@/utils/utils'

type CommentProps = {
    comment: CommentModel
}

export default function Comment({ comment }: CommentProps) {
    return (
        <div>
            <hr />
            <CommentLayout comment={comment} />
        </div>
    )
}

type CommentLayoutProps = {
    comment: CommentModel
}

function CommentLayout({ comment }: CommentLayoutProps) {
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
        </div>
    )
}
