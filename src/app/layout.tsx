import { Metadata } from 'next'
import './globals.scss'
import './utils.css'
import { Inter } from 'next/font/google'
import AuthModalsProvider from './providers/AuthModalsProvider'
import NavBar from './navbar/NavBar'
import { Container } from '@/components/Bootstrap'
import Footer from './footer/Footer'
import OnBoardingRedirect from './OnBoardingRedirect'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Bryan Hadinata | Portfolio',
    description: `Bryan Hadinata's Portfolio - Full Stack Web Developer`,
    twitter: {
        card: 'summary_large_image',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthModalsProvider>
                    <NavBar />
                    <main>
                        <Container className="py-4">{children}</Container>
                    </main>
                    <Footer/>
                    {/* we have to wrap the onBoardingRedirect with Suspense, cuz it is a client component that uses a hook! */}
                    <Suspense> 
                        {/* the thing to remember is, if u have client component and it uses useSearchParams, and this component is rendered on a serverComponent that has a siblings.. */}
                        {/* then we should wrap this component with a suspense boundary, so we don't affect the sibling components..*/}
                        <OnBoardingRedirect/>
                    </Suspense>
                </AuthModalsProvider>
            </body>
        </html>
    )
}
