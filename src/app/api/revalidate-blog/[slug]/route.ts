import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params: { slug } }: { params: { slug: string } }
) {
    try {
        const {searchParams} = new URL(req.url) //this is how we get the full req url.. we need it cuz we need to get access to the searchParams! which has the secret
        const secret = searchParams.get('secret')

        if (!secret || secret !== process.env.POST_REVALIDATION_KEY) {
            return NextResponse.json(
                {error: 'Invalid revalidation key'},
                {status: 401}
            )
        }

        console.log(`Revalidating tag: ${slug}`)
        revalidateTag(slug)

        return NextResponse.json(
            {message: 'Revalidaton successful'},
            {status:200}
        )

    } catch (err) {
        return NextResponse.json(
            {error: 'Revalidation failed'},
            {status: 500}
        )
    }
}
