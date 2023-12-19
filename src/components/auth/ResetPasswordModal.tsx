import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import useCountdown from '@/hooks/useCountdown'
import { emailSchema, passwordSchema, requiredStringSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as UsersApi from '@/network/api/users'
import * as yup from 'yup'
import { BadRequstError, ConflictError, NotFoundError } from '@/network/http-errors'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
import SocialSignInSection from './SocialSignInSection'

const validationSchema = yup.object({
    email: emailSchema.required('Required'),
    password: passwordSchema.required('Required'),
    verificationCode: requiredStringSchema
})

type ResetPasswordFormData = yup.InferType<typeof validationSchema>

type ResetPasswordModalProps = {
    onDismiss: () => void
    onSignUpClicked: () => void
}

export default function ResetPasswordModal({onDismiss, onSignUpClicked}: ResetPasswordModalProps) {
    const { mutateUser } = useAuthenticatedUser()

    const [verificationCodeReqPending, setVerificationCodeReqPending] =
        useState(false)
    const [showVerificationCodeSentText, setShowVerificationCodeSentText] =
        useState(false)
    const {
        start: startVerificationCooldown,
        secondsLeft: verificationCodeCooldownSecondsLeft,
    } = useCountdown() //cooldown hook for setting up the verification code cooldown

    const [errorText, setErrorText] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({ resolver: yupResolver(validationSchema) })

    async function onSubmit(credentials: ResetPasswordFormData) {
        try {
            setShowVerificationCodeSentText(false) //clear up
            setErrorText(null)
            const updatedUser = await UsersApi.resetPassword(credentials)
            mutateUser(updatedUser)
            onDismiss()
        } catch (err) {
            if (err instanceof BadRequstError) {
                //conflict is if the username/password already exists, barReqError iss for if the email verivication code is wrong.. we haven't impllement this tho
                setErrorText(err.message)
            } else {
                console.error(err)
                alert(err)
            }
        }
    }

    async function requestVerificationCode() {
        const validEmailInput = await trigger('email') //this will trigger the email validation schema only!

        if (!validEmailInput) return //the error would be shown cuz the error state of the form would trigger! and that will show the error message below the field like usual. but for this func we want to return if the email is not valid and not bother hitting the api endpoint that will send the email verification code.

        const emailInput = getValues('email') //we have to get the email value this way, cuz we are outisde of the useForm's handleSubmit! this is different than the onSubmit that we pass to the useForm's handleSubmit which will get the values of the form.

        setErrorText(null)
        setShowVerificationCodeSentText(false) //clear up
        setVerificationCodeReqPending(true)

        try {
            await UsersApi.requestPasswordRequestCode(emailInput) //hit the backend endpoint that will verify our email is already taken or not and will write a new entry to the db and THEN, sends the verivication code via Brevo!
            setShowVerificationCodeSentText(true)
            startVerificationCooldown(60)
        } catch (err) {
            if (err instanceof NotFoundError) {
                // if the backend response with a 404, (case of user with the email address is not found )
                setErrorText(err.message)
            } else {
                console.error(err)
                alert(err)
            }
        } finally {
            setVerificationCodeReqPending(false)
        }
    }

    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Reset Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* no validate is to disable normal browser valdiation like for type email.. we will handle it our own */}
                {errorText && <Alert variant="danger">{errorText}</Alert>}
                {showVerificationCodeSentText && (
                    <Alert variant="warning">
                        I sent you a verification code. Please check your inbox!
                    </Alert>
                )}
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        register={register('email')}
                        type="email" //even though we disable
                        label="Email"
                        placeholder="Email"
                        error={errors.email}
                    />
                    <PasswordInputField
                        register={register('password')}
                        type="password"
                        label="New Password"
                        placeholder="New Password"
                        error={errors.password}
                    />
                    <FormInputField
                        register={register('verificationCode')}
                        label="Verification code"
                        placeholder="Verification code"
                        type="number"
                        error={errors.verificationCode}
                        inputGroupElement={
                            <Button
                                id="send-verification-code-button"
                                disabled={
                                    verificationCodeReqPending ||
                                    verificationCodeCooldownSecondsLeft > 0
                                } //we disable if the request is still pending
                                onClick={requestVerificationCode}
                            >
                                Send code{' '}
                                {verificationCodeCooldownSecondsLeft > 0 && // show the cooldown seconds left
                                    `(${verificationCodeCooldownSecondsLeft})`}
                            </Button>
                        }
                    />
                    <LoadingButton
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-100"
                    >
                        Reset Password
                    </LoadingButton>
                </Form>
                {/* <hr /> */}
                {/* <SocialSignInSection /> */}
                <div className="d-flex align-items-center gap-1 justify-content-center mt-1">
                    Don&apos;t have an acoount yet?
                    <Button variant="link" onClick={onSignUpClicked}>
                        Sign Up
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
