import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'
import { BsGithub } from 'react-icons/bs'

export default function GitHubSignInButton() {
    const router = useRouter()

    return (
        <Button
            href={
                process.env.NEXT_PUBLIC_BACKEND_URL +
                `/users/login/github?returnTo=${router.asPath}`
            } //here, we use bootstrap's button as a link, cuz we don't rlly need a nextjs's link.. cuz we want redirect the user to an external url.. it's okay to go to new page for this time around
            variant="dark"
            className="d-flex align-items-center justify-content-center gap-2"
        >
            <BsGithub size={20} />
            Sign in with GitHub
        </Button>
    )
}
