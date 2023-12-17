import axios from 'axios'
import {
    BadRequstError,
    ConflictError,
    NotFoundError,
    TooManyReequestsError,
    UnauthorizedError,
} from './http-errors'

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    timeout: 5000, //if our server doesn't response in 5sec, the request will be aborted.
    withCredentials: true, //this makes axios to send the cookie to other urls
})

axiosInstance.interceptors.response.use(
    null,
    (err) => {
        //basically a middleware for axios lol,
        if (axios.isAxiosError(err)) {
            //check whether the error is from axios or not
            const errorMessage = err.response?.data?.error //this is what we get from our backend! this is the shape: {error: 'bla bla bla'}

            switch (err.response?.status) {
                case 400:
                    throw new BadRequstError(errorMessage) //we send the errorMessage from the backend to our subClass, we can do that, cuz remember, we set the constructor to be able to receive an argument of message!
                case 401:
                    throw new UnauthorizedError(errorMessage)
                case 404:
                    throw new NotFoundError(errorMessage)
                case 409:
                    throw new ConflictError(errorMessage)
                case 429:
                    throw new TooManyReequestsError(errorMessage)
            }
        }

        throw err //just throw the error if it is not an axios error
    },
    { synchronous: true } //if we don't use asynchronous operator in this block of code, we must set the synchronous to ture, idk why, it just says that in the docs
)

// in axios, if the result is of 400 or 500, the result then is automatically thrown as an error.. nice!

export default axiosInstance
