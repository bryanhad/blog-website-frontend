import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { usernameSchema } from '@/utils/validation'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import * as UsersApi from '@/network/api/users'
import { Form } from 'react-bootstrap'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'
import { useEffect } from 'react'

const validationSchema = yup.object({
    username: usernameSchema.required('Required'),
})

type OnbordingInput = yup.InferType<typeof validationSchema>

export default function OnboardingPage() {
    const { user, mutateUser } = useAuthenticatedUser()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OnbordingInput>({ resolver: yupResolver(validationSchema) })

    async function onSubmit({ username }: OnbordingInput) {
        try {
            const updatedUser = await UsersApi.updateUser({
                username,
                displayName: username,
            })
            mutateUser(updatedUser) //update the SWR cached user data
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    useEffect(() => {
        //we redirect the user with useEffect, not on the onSubmitHandler.. cuz what if the user has oppened 2 tabs? the first tab where the user fill in the form and submit the username would be redirected as we expected.. but the second tab would not.
        if (user?.username) {
            const returnTo = router.query.returnTo?.toString() //get the returnTo query that we setup on the onBoardingHook in the _app

            router.push(returnTo || '/')
        }
    }, [user, router]) // this useEffect would run again when the user submit's the form, cuz on onSubmit, we mutate the SWR cached user data, and that would result in the update of this user variable which is one of the depedencies of this useEffect.. nice! 

    return (
        <div>
            <h1>Onboarding</h1>
            <p>
                Thank you for signing up! Before you can continue, please set
                your username!
            </p>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    register={register('username')}
                    placeholder="Username"
                    error={errors.username}
                    maxLength={20}
                />
                <LoadingButton type="submit" isLoading={isSubmitting}>
                    Submit
                </LoadingButton>
            </Form>
        </div>
    )
}
