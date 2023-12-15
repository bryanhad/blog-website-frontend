import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'

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
            <div className={inter.className}>
                <main>
                    <Component {...pageProps} />
                </main>
            </div>
        </>
    )
}
