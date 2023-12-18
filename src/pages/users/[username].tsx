import { User } from '@/models/user.model'
import { GetServerSideProps } from 'next'
import * as UsersApi from '@/network/api/users'
import * as BlogAPi from '@/network/api/blog'
import { useEffect, useState } from 'react'
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
import { NotFoundError } from '@/network/http-errors'
import PaginationBar from '@/components/PaginationBar'

// getServerSideProps will fetch serverSide, but not on build time like getStaticParam
// we do this cuz we always want to get the latest data
export const getServerSideProps: GetServerSideProps<
    UserProfilePageProps
> = async ({ params }) => {
    try {
        const username = params?.username?.toString()
        if (!username) throw Error('username param is missing')

        const userInfo = await UsersApi.getUserByUsername(username)
        return { props: { userInfo } }
    } catch (err) {
        if (err instanceof NotFoundError) {
            return { notFound: true }
        } else {
            throw err
        }
    }
}

type UserProfilePageProps = {
    userInfo: User
}

export default function UserProfilePage({userInfo}:UserProfilePageProps) {
    return (
        <UserProfile userInfo={userInfo} key={userInfo._id}/> //this is niceee.. NO NEED FOR USE EFFECT!!
        // TO HELL OH USE EFFECT THE CAUSE OF UNNECESSARY RERENDERSS >:D
    )
}

function UserProfile({ userInfo }: UserProfilePageProps) {
    const { user: loggedInUser, mutateUser: mutateLoggedInUser } =
        useAuthenticatedUser()

    const [profileUser, setProfileUser] = useState(userInfo)
    // useEffect(() => {
    //     setProfileUser(userInfo)
    // }, [userInfo])
    // this is the usual way of handling a change in the initialstate of the state! but it is not recommended cuz it is not optimal and can cause unnecessary rerenders.. instead we can wrap this whole component to be passed a key which must be unique!
    // when the key's value changes, react knows that the state of the initialstate is not relevant anymore, so the updated initialState will be shown !


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
    //client side pagination, u can use state!

    const [page, setPage] = useState(1)

    const {
        data,
        isLoading: blogPostsLoading,
        error: BlogPostsLoadingError,
    } = useSWR(
        [user._id, page, 'user_posts'], //we can pass multiple params as the cache key! these would be passed into the fetcher function
        //we need all the unique keys that is associated wit the function that we are going to make, to make sure there are no cache clashes!
        // for example, if u only pass in the user._id as the unique cache key for this cache, and just pass the page param to the fetcher callback, you would still get the cached value from the first call, cuz both calls has the same cache key!
        ([userId, pageNum]) => BlogAPi.getBlogPostByUser(userId, pageNum)
    )
    //the key would be forwarded to the function callback!

    const blogPosts = data?.blogPosts || []
    const totalPages = data?.totalPages || 0

    return (
        <div>
            <h2>Blog Posts</h2>
            {blogPosts.length > 0 && <BlogPostsGrid posts={blogPosts} />}
            <div className="d-flex flex-column align-items-center">
                {blogPostsLoading && <Spinner animation="border" />}

                {BlogPostsLoadingError && <p>Blog posts could not be loaded</p>}

                {!blogPostsLoading &&
                    !BlogPostsLoadingError &&
                    blogPosts.length === 0 && (
                        <p>This user hasn&apos;t posted anything yet</p>
                    )}

                {blogPosts.length > 0 && (
                    <PaginationBar
                        currentPage={page}
                        pageCount={totalPages}
                        onPageItemClicked={(pageNum) => setPage(pageNum)}
                        className="mt-4"
                    />
                )}
            </div>
        </div>
    )
}