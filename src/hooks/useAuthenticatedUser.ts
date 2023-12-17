import * as UsersApi from '@/network/api/users'
import { UnauthorizedError } from '@/network/http-errors'
import useSWR from 'swr'

export default function useAuthenticatedUser() {
    const { data, isLoading, error, mutate } = useSWR(
        'user',
        async() => {
            try {
                return await UsersApi.getAuthenticatedUser() //this call uses axios, so if axios returns an error, it would be an instance of axiosError! and so we can do the checking whether the error is one of our defined error in our axios interceptors middleware 
            } catch (err) {
                if (err instanceof UnauthorizedError) {
                    return null //returning null would make SWR not fetch the user over and over again.
                    //the revalidation when we unfocus the window still works tho!
                } else {
                    throw err // if it is not because 401 error (UnauthorizedErrror), just do it like normal and SWR can refetch
                }
            }
        }
    ) //the first arg, is the key that will be used to access the data everywhere in our client component! so it makes state management packages inferior lol xD
    // the mutate func, is for when we want to mutate the cached data from swr! e.g. when we want to login/logout

    // swr is pretty cool! it has the feature of revaldiating the fetched data when we unfocus from the window! 
    // and also, by default, if something goes wrong in the fetch, swr will retry the fetch automatically in certain interval!
    return {
        user: data,
        userLoading: isLoading,
        userLoadingError: error,
        mutateUser: mutate,
    }
}
