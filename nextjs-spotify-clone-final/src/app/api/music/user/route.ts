export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { serverClient } from "@/lib/sanity"

export async function GET() {
    try {
        const session = await getServerSession()

        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        console.log("Fetching music for user:", session.user.email)

        const query = `*[_type == "music" && userId == $email] {
            _id,
            title,
            artist,
            album,
            releaseDate,
            coverImage {
                _type,
                asset
            }
        }`

        const params = { email: session.user.email }
        console.log("Query params:", params)

        const music = await serverClient.fetch(query, params)
        console.log("Fetched music:", JSON.stringify(music, null, 2))

        if (!music || music.length === 0) {
            const allMusic = await serverClient.fetch(`*[_type == "music"]`)
            console.log("All music documents:", allMusic)
        }

        return NextResponse.json(music)
    } catch (error) {
        console.error("Error fetching user music:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}