import { User } from '@/models/user.model'
import api from '@/network/axiosInstance'

export async function getAuthenticatedUser() {
    const res = await api.get<User>('/users/me')
    return res.data
}

type SignUpValues = {
    username: string
    email: string
    password: string
}

export async function signUp(credentials: SignUpValues) {
    const res = await api.post<User>('/users/signup', credentials)
    return res.data
}

type LoginValues = {
    username:string
    password:string
}

export async function login(credentials: LoginValues) {
    const res = await api.post<User>('/users/login', credentials)
    return res.data
}

export async function logout() {
    await api.post('/users/logout') //the await is till important cuz if there's an error we still want the error to be thrown to the catch block
    //only by adding await, the errror would be thrown to the catch block
}