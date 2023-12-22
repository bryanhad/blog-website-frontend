'use client'

import LoadingButton from '@/components/LoadingButton'
import FormInputField from '@/components/form/FormInputField'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import { User } from '@/models/user.model'
import * as UsersApi from '@/network/api/users'
import { useRouter } from 'next/navigation'
import { Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type UpdateUserProfileSectionProps = {
    user: User
}

const validationSchema = yup.object({
    displayName: yup.string(),
    about: yup.string(),
    profilePic: yup.mixed<FileList>(), //no need to check cuz all of these update profile field is optional!
})

type UpdateUserProfileFormData = yup.InferType<typeof validationSchema>

export default function UpdateUserProfileSection({
    user: profileUser,
}: UpdateUserProfileSectionProps) {
    const { user: loggedInUser, mutateUser: mutateLoggedInUser } =
        useAuthenticatedUser()

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<UpdateUserProfileFormData>()

    async function onSubmit({
        displayName,
        profilePic,
        about,
    }: UpdateUserProfileFormData) {
        if (!displayName && !about && (!profilePic || profilePic.length === 0))
            return

        try {
            const updatedUser = await UsersApi.updateUser({
                displayName,
                about,
                profilePic: profilePic?.item(0) || undefined,
            })
            handleUpdateUser(updatedUser) //update the state and mutate the cached SWR data! this is a prop that is send from the parent
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    function handleUpdateUser(updatedUser: User) {
        mutateLoggedInUser(updatedUser) //update the cached logged User data
        router.refresh()
    }

    const profileUserIsLoggedInUser =
        (loggedInUser && loggedInUser._id === profileUser._id) || false

    if (!profileUserIsLoggedInUser) return null

    return (
        <div>
            <hr />
            <h2>Update profile</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormInputField
                    register={register('displayName')}
                    label="Display name"
                    placeholder="Display name"
                    maxLength={20}
                />
                <FormInputField
                    register={register('about')}
                    label="About me"
                    placeholder="Tell us a few thing about you"
                    maxLength={160}
                    as={'textarea'}
                />
                <FormInputField
                    register={register('profilePic')}
                    label="Profile picture"
                    type="file"
                    accept="image/png,image/jpeg"
                />
                <LoadingButton type="submit" isLoading={isSubmitting}>
                    Update Profile
                </LoadingButton>
            </Form>
        </div>
    )
}
