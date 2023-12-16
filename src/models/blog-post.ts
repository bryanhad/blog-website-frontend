export type CreateBlogPostValues = {
    slug: string
    title: string
    summary: string
    body: string
    blogImage: string
}

export type BlogPost = {
    _id: string
    createdAt: string
    updatedAt: string
} & CreateBlogPostValues
