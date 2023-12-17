import '@/styles/globals.scss'
import '@/styles/utils.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { Container, SSRProvider } from 'react-bootstrap'
import styles from '@/styles/App.module.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import NextNProgress from 'nextjs-progressbar'
import SignUpModal from '@/components/auth/SignUpModal'
import LoginModal from '@/components/auth/LoginModal'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'

const inter = Inter({ subsets: ['latin'] })

//this is like the layout.tsx in app directory!

export default function App({ Component, pageProps }: AppProps) {
    const { user, userLoading, userLoadingError, mutateUser } =
        useAuthenticatedUser()

    return (
        <>
            <Head>
                <title>Bryan Hadinata | Portfolio</title>
                <meta
                    name="description"
                    content="Bryan Hadinata's Portfolio - Full Stack Web Developer"
                />
                <meta
                    name="keywords"
                    content="web development, web design, portfolio, Bryan Hadinata"
                />
                <meta name="author" content="Bryan Hadinata" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <SSRProvider>
                <div className={inter.className}>
                    <NextNProgress color="#21FA90" />
                    <NavBar />
                    <h1>{user?.username}</h1>
                    <main>
                        <Container className={styles.mainContainer}>
                            <Component {...pageProps} />
                        </Container>
                    </main>
                    <Footer />
                    {/* <LoginModal
                        onDismiss={() => {}}
                        onSignUpInsteadClicked={() => {}}
                        onForgotPasswordClicked={() => {}}
                    /> */}
                </div>
            </SSRProvider>
        </>
    )
}
