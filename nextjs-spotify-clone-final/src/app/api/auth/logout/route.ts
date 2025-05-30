import { NextResponse } from "next/server"

export async function POST() {
    try {
        //Clearing any session cookies or tokens
        const response = NextResponse.json(
            { message: "Logout Successful"},
            {status: 200}
        )

        response.cookies.set("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        })
        return response
    } catch (error) {
        console.error("Logout Error", error)
        return NextResponse.json(
            { message: "Error During Logout" },
            { status: 500 }
        )
    }
}