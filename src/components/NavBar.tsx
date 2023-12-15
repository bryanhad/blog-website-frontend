import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container, Nav, NavLink, Navbar } from 'react-bootstrap'
import { FiEdit } from 'react-icons/fi'
import Image from 'next/image'
import styles from '@/styles/Navbar.module.css'

export default function NavBar() {
    const router = useRouter() //this hookis to get

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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
