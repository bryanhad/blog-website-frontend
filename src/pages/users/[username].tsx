import { User } from '@/models/user.model'
import { GetServerSideProps } from 'next'
import * as UsersApi from '@/network/api/users'
import * as BlogAPi from '@/network/api/blog'
import { useState } from 'react'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import Head from 'next/head'
import { Col, Form, Row, Spinner } from 'react-bootstrap'
import Image from 'next/image'
import styles from '@/styles/UserProfilePage.module.css'
import { formatDate } from '@/utils/utils'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import FormInputField from '@/components/form/FormInputField'
import LoadingButton from '@/components/LoadingButton'
import useSWR from 'swr'
import BlogPostsGrid from '@/components/BlogPostsGrid'

// getServerSideProps will fetch serverSide, but not on build time like getStaticParam
// we do this cuz we always want to get the latest data
export const getServerSideProps: GetServerSideProps<
    UserProfilePageProps
> = async ({ params }) => {
    const username = params?.username?.toString()
    if (!username) throw Error('username param is missing')

    const user = await UsersApi.getUserByUsername(username)

    return { props: { user } }
}

type UserProfilePageProps = {
    user: User
}

export default function UserProfilePage({ user }: UserProfilePageProps) {
    const { user: loggedInUser, mutateUser: mutateLoggedInUser } =
        useAuthenticatedUser()

    const [profileUser, setProfileUser] = useState(user)

    const profileUserIsLoggedInUser =
        (loggedInUser && loggedInUser._id === profileUser._id) || false
    //we did encapsulate the expression in another parantheses like this cuz we want the value of profileserIsLoggedInUser to be a boolean! cuz the loggedInUser variable could be null or undefined

    function handleUpdateUser(updatedUser: User) {
        mutateLoggedInUser(updatedUser) //update the cached logged User data
        setProfileUser(updatedUser) //update the user data state in this profile page
    }

    return (
        <>
            <Head>
                <title>{`${profileUser.username} - Bryan Hadinata`}</title>
            </Head>
            <div>
                {/* profileUser is just the info of the user's profile */}
                <UserInfoSection user={profileUser} />
                {profileUserIsLoggedInUser && (
                    <>
                        <hr />
                        <UpdateUserProfileSection
                            onUserUpdated={handleUpdateUser}
                        />
                    </>
                )}
                <hr />
                <UserBlogsSection user={profileUser} />
            </div>
        </>
    )
}
type UserInfoSectionProps = {
    user: User
}

function UserInfoSection({
    user: { username, displayName, profilePicUrl, about, createdAt },
}: UserInfoSectionProps) {
    return (
        <Row>
            {/* sm='auto' makes so the column for this is going to be only as wide as it needs to be */}
            <Col sm="auto">
                <Image
                    src={profilePicUrl || '/no-profile-pic.png'}
                    alt={`${username}'s Profile Picture`}
                    height={200}
                    width={200}
                    priority
                    className={`rounded ${styles.profilePic}`}
                />
            </Col>
            <Col className="mt-2 mt-sm-0">
                <h1>{displayName}</h1>
                <div>
                    <strong>Username: </strong>
                    {username}
                </div>
                <div>
                    <strong>User since: </strong>
                    {formatDate(createdAt)}
                </div>
                <div className="pre-line">
                    <strong>About me:</strong> <br />
                    {about || "This user hasn't shared any info yet"}
                </div>
            </Col>
        </Row>
    )
}

const validationSchema = yup.object({
    displayName: yup.string(),
    about: yup.string(),
    profilePic: yup.mixed<FileList>(), //no need to check cuz all of these update profile field is optional!
})

type UpdateUserProfileFormData = yup.InferType<typeof validationSchema>

type UpdateUserProfileSectionProps = {
    onUserUpdated: (updatedUser: User) => void
}

function UpdateUserProfileSection({
    onUserUpdated,
}: UpdateUserProfileSectionProps) {
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
            onUserUpdated(updatedUser) //update the state and mutate the cached SWR data! this is a prop that is send from the parent
        } catch (err) {
            console.error(err)
            alert(err)
        }
    }

    return (
        <div>
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

type UserBlogsSectionProps = {
    user: User
}

function UserBlogsSection({ user }: UserBlogsSectionProps) {
    const {
        data: blogPosts,
        isLoading: blogPostsLoading,
        error: BlogPostsLoadingError,
    } = useSWR(user._id, BlogAPi.getBlogPostByUser)
    //the key would be forwarded to the function callback!
    //it is the same as (userId) => BlogApi.getBlogPostByUser(userId)
    return (
        <div>
            <h2>Blog Posts</h2>
            <div className="d-flex flex-column align-items-center">
                {blogPostsLoading && <Spinner animation="border" />}
                {BlogPostsLoadingError && <p>Blog posts could not be loaded</p>}
                {blogPosts?.length === 0 && (
                    <p>This user hasn&apos;t posted anything yet</p>
                )}
            </div>
            {blogPosts && <BlogPostsGrid posts={blogPosts} />}
        </div>
    )
}
