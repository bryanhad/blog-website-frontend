import { User } from '@/models/user.model'
import api from '@/network/axiosInstance'

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