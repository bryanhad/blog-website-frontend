'use client'

import PaginationBar from '@/components/PaginationBar'
import { useRouter } from 'next/navigation'

type BlogPaginationBarProps = {
    currentPage:number
    totalPages: number
}

export default function BlogPaginationBar({currentPage, totalPages}:BlogPaginationBarProps) {
    const router = useRouter()

    return (
        <PaginationBar
            currentPage={currentPage}
            pageCount={totalPages}
            onPageItemClicked={(pageNum) => {
                router.push(`/blog?page=` + pageNum)
            }}
            className="mt-4"
        />
    )
}