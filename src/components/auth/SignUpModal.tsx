import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as UserApi from '@/network/api/users'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { useState } from 'react'
import { BadRequstError, ConflictError } from '@/network/http-errors'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { emailSchema, passwordSchema, usernameSchema } from '@/utils/validation'

const validationSchema = yup.object({
    username: usernameSchema.required('Required'),
    email: emailSchema.required('Required'),
    password: passwordSchema.required('Required'),
})

type SignUpFormData = yup.InferType<typeof validationSchema>

type SignUpModalProps = {
    onDismiss: () => void
    onLoginInsteadClicked: () => void
}

export default function SignUpModal({
    onDismiss,
    onLoginInsteadClicked,
}: SignUpModalProps) {
    const {mutateUser} = useAuthenticatedUser()

    const [errorText, setErrorText] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({resolver: yupResolver(validationSchema)})

    async function onSubmit(credentials: SignUpFormData) {
        try {
            setErrorText(null)
            const newUser = await UserApi.signUp(credentials)
            mutateUser(newUser)
            onDismiss()
        } catch (err) {
            if (err instanceof ConflictError || err instanceof BadRequstError) { //conflict is if the username/password already exists, barReqError iss for if the email verivication code is wrong.. we haven't impllement this tho
                setErrorText(err.message)
            } else {
                console.error(err)
                alert(err)
            }
        }
    }

    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* no validate is to disable normal browser valdiation like for type email.. we will handle it our own */}
                {errorText && <Alert variant="danger">{errorText}</Alert>}
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        register={register('username')}
                        label="Username"
                        placeholder="Username"
                        error={errors.username}
                    />
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
                        label="Password"
                        placeholder="Password"
                        error={errors.password}
                    />
                    <LoadingButton
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-100"
                    >
                        Sign Up
                    </LoadingButton>
                </Form>
                <div className='d-flex align-items-center gap-1 justify-content-center mt-1'>
                    Already have an account?
                    <Button variant='link' onClick={onLoginInsteadClicked}>
                        Log In
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}
