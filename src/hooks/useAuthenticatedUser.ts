import * as UsersApi from '@/network/api/users'
import useSWR from 'swr'

export default function useAuthenticatedUser() {
    const { data, isLoading, error, mutate } = useSWR(
        'user',
        UsersApi.getAuthenticatedUser
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
