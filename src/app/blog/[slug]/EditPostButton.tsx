'use client'

import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'
import Link from 'next/link'
import React from 'react'
import { FiEdit } from 'react-icons/fi'

type EditPostButtonProps = {
    slug: string
    authorId: string
}

export default function EditPostButton({
    slug,
    authorId,
}: EditPostButtonProps) {
    const { user } = useAuthenticatedUser()

    if (!user || user._id !== authorId) return null

    return (
        <Link
            href={`/blog/edit/${slug}`}
            className="btn btn-outline-primary d-inline-flex align-items-center gap-1 mb-2"
        >
            <FiEdit />
            Edit post
        </Link>
    )
}
