import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'
import { FcGoogle } from 'react-icons/fc'

export default function GoogleSignInButton() {
    const router = useRouter()

    return (
        <Button
            href={
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/users/login/google?returnTo=${router.asPath}`
            } //here, we use bootstrap's button as a link, cuz we don't rlly need a nextjs's link.. cuz we want redirect the user to an external url.. it's okay to go to new page for this time around
            variant="light"
            className="d-flex align-items-center justify-content-center gap-1 "
        >
            <FcGoogle size={20} />
            Sign in with Google
        </Button>
    )
}
