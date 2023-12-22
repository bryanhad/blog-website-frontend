import noProfilePic from '@/assets/images/no-profile-pic.png'
import { User } from '@/models/user.model'
import * as UsersApi from '@/network/api/users'
import { NotFoundError } from '@/network/http-errors'
import styles from './UserProfilePage.module.css'
import { formatDate } from '@/utils/utils'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { Col, Row } from '@/components/Bootstrap'
import UpdateUserProfileSection from './UpdateUserProfileSection'
import UserBlogsSection from './UserBlogPostsSection'

// This page is automatically uses dynamic rendering! cuz we use the params prop without generateStaticParams!

type UserProfilePageProps = {
    params: { username: string }
}

const getUser = cache(async (username: string) => {
    try {
        return await UsersApi.getUserByUsername(username)
    } catch (err) {
        if (err instanceof NotFoundError) {
            notFound()
        } else {
            throw err
        }
    }
})

export async function generateMetadata({
    params: { username },
}: UserProfilePageProps): Promise<Metadata> {
    const user = await getUser(username)
    return {
        title: `${user.username} - Bryan's Blog`,
    }
}

export default async function UserProfilePage({
    params: { username },
}: UserProfilePageProps) {
    const user = await getUser(username)

    return (
        <div>
            <UserInfoSection user={user} />
            <UpdateUserProfileSection user={user} />
            <UserBlogsSection user={user} />
        </div>
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
                    src={profilePicUrl || noProfilePic}
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
