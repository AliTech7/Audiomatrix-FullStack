export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { serverClient } from "@/lib/sanity"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse(
                JSON.stringify({ message: "Unauthorized" }),
                { status: 401 }
            )
        }

        const musicQuery = `*[_type == "music" && userId == $email] {
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

        const [profileData, musicData] = await Promise.all([
            Promise.resolve({
                name: session.user.name,
                email: session.user.email,
                createdAt: session.user.createdAt,
            }),
            serverClient.fetch(musicQuery, { email: session.user.email })
        ])

        return NextResponse.json({
            profile: profileData,
            music: musicData
        })
    } catch (error) {
        console.error("Profile Error:", error)
        return new NextResponse(
            JSON.stringify({ message: "Internal Server Error" }),
            { status: 500 }
        )
    }
} 