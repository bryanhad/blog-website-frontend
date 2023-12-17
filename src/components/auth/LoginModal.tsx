import { useForm } from 'react-hook-form'
import * as UserApi from '@/network/api/users'
import { Button, Form, Modal } from 'react-bootstrap'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'
import LoadingButton from '../LoadingButton'
type LoginFormData = {
    username: string
    password: string
}

type LoginModalProps = {
    onDismiss: () => void
    onSignUpInsteadClicked: () => void
    onForgotPasswordClicked: () => void
}

export default function LoginModal({
    onDismiss,
    onSignUpInsteadClicked,
    onForgotPasswordClicked,
}: LoginModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>()

    async function onSubmit(credentials: LoginFormData) {
        try {
            const user = await UserApi.login(credentials)
            alert(JSON.stringify(user))
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    return (
        <Modal show onHide={onDismiss} centered>
            <Modal.Header>
                <Modal.Title>Log In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInputField
                        register={register('username')}
                        label="Username"
                        placeholder="Username"
                        error={errors.username}
                    />
                    <PasswordInputField
                        register={register('password')}
                        type="password"
                        label="Password"
                        placeholder="Password"
                        error={errors.password}
                    />
                    {/* we can use negative margin that we have to declare in the custom-theme.scss to make the Forgot password not be affected by the InfpurField's default mb-3 */}
                    <Button
                        variant="link"
                        className="d-block ms-auto mt-n3 mb-3 small"
                        onClick={onForgotPasswordClicked}
                    >
                        Forgot Password?
                    </Button>
                    <LoadingButton
                        type="submit"
                        isLoading={isSubmitting}
                        className="w-100"
                    >
                        Log In
                    </LoadingButton>
                </Form>
                <div className='d-flex align-items-center gap-1 justify-content-center mt-1'>
                    Don&apos;t have an account yet?
                    <Button variant='link'>
                        Sign Up
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    )
}