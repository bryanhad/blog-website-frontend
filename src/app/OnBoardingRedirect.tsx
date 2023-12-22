'use client'

import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function OnBoardingRedirect() {
    const { user } = useAuthenticatedUser()

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (user && !user.username && pathname !== '/onboarding') {
            router.push(
                '/onboarding?returnTo=' +
                    encodeURIComponent(
                        //encode a searchparamsObject as a string UI
                        pathname +
                            (searchParams?.size ? '?' + searchParams : '') // if the size is larger that 0, add '?' if not ''
                    )
            ) //searchParams is the same as router.pathname, but it still maintains the query!
        }
    }, [user, router, pathname, searchParams])
    
    return null
}
