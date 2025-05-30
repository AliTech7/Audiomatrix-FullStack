export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../[...nextauth]/route"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return new NextResponse(
                JSON.stringify({ message: "Unathorized" }),
                { status: 401}
            )
        }

        return NextResponse.json({
            name: session.user.name,
            email: session.user.email,
            createdAt: session.user.createdAt, 
        })
    } catch (error) {
        console.error("Profile Eroor:", error)
        return new NextResponse(
            JSON.stringify( {
                message: "Internal Server Error"
            }),
            { status: 500}
        )
    }
}