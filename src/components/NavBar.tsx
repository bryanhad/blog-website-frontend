import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import styles from '@/styles/Navbar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { FiEdit } from 'react-icons/fi'
import LoginModal from './auth/LoginModal'
import SignUpModal from './auth/SignUpModal'

export default function NavBar() {
    const { user } = useAuthenticatedUser()
    const router = useRouter()

    return (
        <Navbar
            variant="dark"
            collapseOnSelect
            expand="md"
            bg="body"
            sticky="top"
        >
            <Container>
                <Navbar.Brand as={Link} href="/" className="d-flex gap-1">
                    <Image
                        src={'/logo.png'}
                        alt="Bryan Hadinata's logo"
                        width={30}
                        height={30}
                    />
                    <span className={styles.brandText}>Bryan Hadinata</span>
                </Navbar.Brand>
                {/* aria controls helps screen readers to navigate! good accessibility! */}
                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav>
                        {/* we have to use the as attribute to assign the Next-Link to the Nav.Link from bootstrap */}
                        {/* this ensures that the bootstrap Link will behave like Next's Link that doesn't relaod the page! */}
                        {/* we also use Nav.Link instead of Next's Link so that the burger button will collapse when we click on the link! it will not work if u use normal Link.. */}
                        <Nav.Link
                            as={Link}
                            href="/"
                            active={router.pathname === '/'}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            active={router.pathname === '/blog'}
                            as={Link}
                            href="/blog"
                        >
                            Blogs
                        </Nav.Link>
                    </Nav>
                    {user ? <LoggedInView /> : <LoggedOutView />}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

function LoggedInView() {
    return (
        <Nav className="ms-auto">
            <Nav.Link
                as={Link}
                href="/blog/new"
                className="link-primary d-flex align-items-center gap-1"
            >
                <FiEdit />
                Create post
            </Nav.Link>
        </Nav>
    )
}

function LoggedOutView() {
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showSignUpModal, setShowSignUpModal] = useState(false)

    return (
        <>
            <Nav className="ms-auto">
                <Button
                    variant="outline-primary"
                    className="ms-md-2 mt-2 mt-md-0"
                    onClick={() => setShowLoginModal(true)}
                >
                    Log In
                </Button>
                <Button
                    className="ms-md-2 mt-2 mt-md-0"
                    onClick={() => setShowSignUpModal(true)}
                >
                    Sign Up
                </Button>
            </Nav>
            {showLoginModal && (
                <LoginModal
                    onDismiss={() => setShowLoginModal(false)}
                    onSignUpInsteadClicked={() => {
                        setShowLoginModal(false)
                        setShowSignUpModal(true)
                    }}
                    onForgotPasswordClicked={() => {}}
                />
            )}
            {showSignUpModal && (
                <SignUpModal
                    onDismiss={() => setShowSignUpModal(false)}
                    onLoginInsteadClicked={() => {
                        setShowSignUpModal(false)
                        setShowLoginModal(true)
                    }}
                />
            )}
        </>
    )
}
