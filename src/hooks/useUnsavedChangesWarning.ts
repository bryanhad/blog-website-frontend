import { useRouter } from 'next/router'
import nProgress from 'nprogress'
import { useEffect } from 'react'

export default function useUnsavedChangesWarning(condition: boolean) {
    const router = useRouter()

    useEffect(() => {
        const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
            if (condition) {
                e.preventDefault()
                e.returnValue = true
            }
        }

        const routeChangeStartHandler = () => {
            if (
                condition &&
                !window.confirm(
                    'You hav unsaved changes. Do you want to leave the page?'
                )
            ) {
                nProgress.done() //stops the nextjs-progressbar from being stuck, cuz it thinks that we are still redirecting from clicking the next Link, we have to tell that we are not redirecting manyally :)

                throw 'routeChange aborted' //doen't matter what we throw, what we want is to just throw something to stop the redirect from clicking the next Link
            }
        }

        window.addEventListener('beforeunload', beforeUnloadHandler)
        router.events.on('routeChangeStart', routeChangeStartHandler) //attach a listener to next router's routeChangeStart, or when we click some next Link!

        return () => {
            //this return would be executed before the next useEffect is executed and before the component unmounts. this is how u make clean up for your event listeners
            window.removeEventListener('beforeunload', beforeUnloadHandler)
            router.events.off('routeChangeStart', routeChangeStartHandler)
        }
    }, [condition, router.events])
}
