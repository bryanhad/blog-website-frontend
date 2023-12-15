import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { Container, SSRProvider } from 'react-bootstrap'
import styles from '@/styles/App.module.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

//this is like the layout.tsx in app directory!

export default function App({ Component, pageProps }: AppProps) {
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
                    <NavBar/>
                    <main>
                        <Container className={styles.mainContainer}>
                            <Component {...pageProps} />
                        </Container>
                    </main>
                    <Footer/>
                </div>
            </SSRProvider>
        </>
    )
}
