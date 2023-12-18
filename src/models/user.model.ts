export type User = {
    _id:string
    username?:string //when we sign up using social provider, the username isn't going to be set by default..
    email?:string
    displayName?:string
    about?:string
    profilePicUrl?:string
    createdAt:string
    updatedAt:string
}