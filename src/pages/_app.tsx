import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import AuthModalsProvider from '@/components/auth/AuthModalsProvider'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import styles from '@/styles/App.module.css'
import '@/styles/globals.scss'
import '@/styles/utils.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { useRouter } from 'next/router'
import NextNProgress from 'nextjs-progressbar'
import { useEffect } from 'react'
import { Container, SSRProvider } from 'react-bootstrap'

const inter = Inter({ subsets: ['latin'] })

//this is like the layout.tsx in app directory!

export default function App({ Component, pageProps }: AppProps) {
    useOnboardingRedirect()

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
                <meta property='og:image' key='og:image' content='https://bryanhadinata.com/social_media_preview_image.png'/>
                <meta name='twitter:card' content='summary_large_image' /> 
            </Head>

            <SSRProvider>
                <AuthModalsProvider>
                    <div className={inter.className}>
                        <NextNProgress color="black" />
                        <NavBar />
                        <main>
                            <Container className={styles.mainContainer}>
                                <Component {...pageProps} />
                            </Container>
                        </main>
                        <Footer />
                    </div>
                </AuthModalsProvider>
            </SSRProvider>
        </>
    )
}

function useOnboardingRedirect() {
    const { user } = useAuthenticatedUser()

    const router = useRouter()

    useEffect(() => {
        if (user && !user.username && router.pathname !== '/onboarding') {
            router.push('/onboarding?returnTo=' + router.asPath) //router.asPath is the same as router.pathname, but it still maintains the query!
        }
    }, [user, router])
}
