import { User } from '@/models/user.model'
import api from '@/network/axiosInstance'

export async function getAuthenticatedUser() {
    const res = await api.get<User>('/users/me')
    return res.data
}

export async function getUserByUsername(username: string) {
    const res = await api.get<User>(`/users/profile/${username}`)
    return res.data
}

type SignUpValues = {
    username: string
    email: string
    password: string
    verificationCode: string
}

export async function signUp(credentials: SignUpValues) {
    const res = await api.post<User>('/users/signup', credentials)
    return res.data
}

export async function requestEmailVerificationCode(email: string) {
    await api.post('/users/verification-code', { email })
}

export async function requestPasswordRequestCode(email:string) {
    await api.post('/users/reset-password-code', {email})
}

type ResetPasswordValues = {
    email: string
    password: string
    verificationCode: string
}

export async function resetPassword(credentials: ResetPasswordValues) {
    const res = await api.post<User>('/users/reset-password', credentials)
    return res.data
}

type LoginValues = {
    username: string
    password: string
}

export async function login(credentials: LoginValues) {
    const res = await api.post<User>('/users/login', credentials)
    return res.data
}

export async function logout() {
    await api.post('/users/logout') //the await is till important cuz if there's an error we still want the error to be thrown to the catch block
    //only by adding await, the errror would be thrown to the catch block
}

type UpdateUserValues = {
    username?: string
    displayName?: string
    about?: string
    profilePic?: File
}

export async function updateUser(input: UpdateUserValues) {
    const formData = new FormData()
    Object.entries(input).forEach(([key, value]) => {
        //loop through the input object to put em all in the formData!
        // cuz u have to send the data in formData to support File type!
        if (value !== undefined) {
            // the condition is if it is not undefined! cuz if we use the truthy operator, a boolean false would not be inputed :( no bueno
            formData.append(key, value)
        }
    })
    const res = await api.patch<User>('/users/me', formData)
    return res.data //return the updated user
}
