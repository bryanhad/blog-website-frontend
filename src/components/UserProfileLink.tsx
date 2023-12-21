import { User } from '@/models/user.model'
import { formatDate } from '@/utils/utils'
import Image from 'next/image'
import Link from 'next/link'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import noProfilePic from '@/assets/images/no-profile-pic.png'

type UserProfileLinkProps = {
    user: User
}

export default function UserProfileLink({ user }: UserProfileLinkProps) {
    return (
        <OverlayTrigger
            overlay={
                <Tooltip className='position-absolute'>
                    <UserToolTipContent user={user} />
                </Tooltip>
            }
            delay={{ show: 500, hide: 0 }}
        >
            <span className="d-flex align-items-center w-fit-content">
                <Image
                    src={user.profilePicUrl || noProfilePic}
                    width={40}
                    height={40}
                    alt={`${user.username}'s Profile Pic`}
                    className="rounded-circle"
                />
                <Link href={'/users/' + user.username} className="ms-2">
                    {user.displayName}
                </Link>
            </span>
        </OverlayTrigger>
    )
}

type UserToolTipContentProps = {
    user: User
}

function UserToolTipContent({
    user: { username, about, profilePicUrl, createdAt },
}: UserToolTipContentProps) {
    return (
        <div className="p-2">
            <Image
                src={profilePicUrl || noProfilePic}
                width={150}
                height={150}
                alt={`${username}'s Profile Pic`}
                className="rounded-circle mb-1"
            />
            <div className="text-start">
                <strong>Username:</strong> {username} <br />
                <strong>User since:</strong> {formatDate(createdAt)} <br />
                {about && (
                    <>
                        <strong>About:</strong> {about}
                    </>
                )}
            </div>
        </div>
    )
}
