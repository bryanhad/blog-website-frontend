// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const secret = req.query.secret // we only want this endpoint to be accessible by us only! so we can check our secretsss

    if (!secret || secret !== process.env.POST_REVALIDATION_KEY) {
        return res.status(401).json({ error: 'Invalid revalidation key' })
    }

    try {
        // kinda weit that we access the slug from the query eventhough we pass it through the params lol
        
        await res.revalidate('/blog/' + req.query.slug)//this revalidation makes so that the next's cache will be updated! and it just like the user (author who updates) helps to update the build cache to be the updated version! 
        // so when other user's visit the page, they will be served the updated cache!
        res.status(200).json({ message: 'Revalidaton successful' })
    } catch (err) {
        res.status(500).json({ error: 'Revalidation failed' })
    }
}
