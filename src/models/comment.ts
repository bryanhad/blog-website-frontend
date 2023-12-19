import { User } from './user.model'

export type Comment = {
    _id: string //remember, all the id would be a string cuz we send the data with a json!
    blogId: string
    parentCommentId?: string
    author: User
    text: string

    createdAt:string
    updatedAt:string
}

export type GetCommentsResponse = {
    comments: Comment[],
    endOfPaginationReached: boolean
}