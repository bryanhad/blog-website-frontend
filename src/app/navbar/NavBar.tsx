'use client'

import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { User } from '@/models/user.model'
import * as UsersApi from '@/network/api/users'
import styles from './Navbar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useContext } from 'react'
import { Button, Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { FiEdit } from 'react-icons/fi'
import { AuthModalsContext } from '@/app/providers/AuthModalsProvider'
import logo from '@/assets/images/logo.png'
import noProfilePic from '@/assets/images/no-profile-pic.png'

export default function NavBar() {
    const { user } = useAuthenticatedUser()
    const pathname = usePathname()


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
                        src={logo}
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
                            active={pathname === '/'}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            active={pathname === '/blog'}
                            as={Link}
                            href="/blog"
                        >
                            Blogs
                        </Nav.Link>
                    </Nav>
                    {user ? <LoggedInView user={user} /> : <LoggedOutView />}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

type LoggedInViewProps = {
    user: User
}

function LoggedInView({ user }: LoggedInViewProps) {
    const { mutateUser } = useAuthenticatedUser() //for logout

    async function logout() {
        try {
            await UsersApi.logout()
            mutateUser(null) //set the cached user by SWR to null
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

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
            {/* when the user signed up using social prrovider, the displayname isn't set by defaullt*/}
            <Navbar.Text className="ms-md-3">
                Hey, {user.displayName || 'User'}!
            </Navbar.Text>
            <NavDropdown
                className={styles.accountDropdown}
                title={
                    <Image
                        src={user.profilePicUrl || noProfilePic}
                        alt="User profile picture"
                        width={40}
                        height={40}
                        className="rounded-circle"
                    />
                }
            >
                {user.username && (
                    <>
                        <NavDropdown.Item
                            as={Link}
                            href={'/users/' + user?.username}
                        >
                            Profile
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                    </>
                )}
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
            </NavDropdown>
        </Nav>
    )
}

function LoggedOutView() {
    const { showLoginModal, showSignUpModal } = useContext(AuthModalsContext)
    return (
        <Nav className="ms-auto">
            <Button
                variant="outline-primary"
                className="ms-md-2 mt-2 mt-md-0"
                onClick={showLoginModal}
            >
                Log In
            </Button>
            <Button className="ms-md-2 mt-2 mt-md-0" onClick={showSignUpModal}>
                Sign Up
            </Button>
        </Nav>
    )
}
