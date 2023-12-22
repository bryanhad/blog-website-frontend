'use client'

import { createContext, useState } from 'react'
import LoginModal from '@/components/auth/LoginModal'
import SignUpModal from '@/components/auth/SignUpModal'
import ResetPasswordModal from '@/components/auth/ResetPasswordModal'

type AuthModalsContext = {
    showLoginModal: () => void
    showSignUpModal: () => void
    showResetPasswordModal: () => void
}

export const AuthModalsContext = createContext<AuthModalsContext>({
    showLoginModal: () => {
        throw Error('AuthModalsContext not implemented correctly')
    },
    showSignUpModal: () => {
        throw Error('AuthModalsContext not implemented correctly')
    },
    showResetPasswordModal: () => {
        throw Error('AuthModalsContext not implemented correctly')
    },
})

type AuthModalsProviderProps = {
    children: React.ReactNode
}

export default function AuthModalsProvider({
    children,
}: AuthModalsProviderProps) {
    
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showSignUpModal, setShowSignUpModal] = useState(false)
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)


    // when the component rerender, it will compare to the previous value object, even though the value is still the same, but it is AN OBJECT! where in JS, two objects with the value 100% same would be different in terms of the reference..
    // this is a problem that cuz our childrens would also be rerendered, cuz react thinks the value has been changed..
    // it's just unnecessary rerenders..

    // so, we can wrap the value object with a useState to let react know that the prev value obj is the same and there is no need for rerender.. 
    const [value] = useState({
        showLoginModal: () => setShowLoginModal(true),
        showSignUpModal: () => setShowSignUpModal(true),
        showResetPasswordModal: () => setShowResetPasswordModal(true),
    })

    return (
        <AuthModalsContext.Provider value={value}>
            {children}
            {showLoginModal && (
                <LoginModal
                    onDismiss={() => setShowLoginModal(false)}
                    onSignUpInsteadClicked={() => {
                        setShowLoginModal(false)
                        setShowSignUpModal(true)
                    }}
                    onForgotPasswordClicked={() => {
                        setShowLoginModal(false)
                        setShowResetPasswordModal(true)
                    }}
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
            {showResetPasswordModal && (
                <ResetPasswordModal
                    onDismiss={() => setShowResetPasswordModal(false)}
                    onSignUpClicked={() => {
                        setShowResetPasswordModal(false)
                        setShowSignUpModal(true)
                    }}
                />
            )}
        </AuthModalsContext.Provider>
    )
}
