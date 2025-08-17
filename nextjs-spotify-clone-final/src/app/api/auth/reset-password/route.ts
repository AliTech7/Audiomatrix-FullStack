import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import bcrypt from "bcryptjs";

const client = createClient({
    projectId: "584oofht",
    dataset: "production",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: "2025-08-16",
})

export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json()

        if (!token || !newPassword) {
            return NextResponse.json({ message: "Token and password are required" }, { status: 400 })
        }

        const query = `*[_type=="user" && resetPasswordToken == $token && resetPasswordExpires > $now]`
        const users = await client.fetch(query, { token, now: Date.now() })

        if (!users || users.length === 0) {
            return NextResponse.json({ message: "Invalid or expired token " }, { status: 400 })
        }

        const user = users[0]
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await client
            .patch(user._id)
            .set({
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            })
            .commit()

        return NextResponse.json({ message: "Password has been reset successfully!" })
    } catch (err) {
        console.error("Reset Password Error:", err)
        return NextResponse.json({ message: " An error occurred. Please try again later" }, { status: 500 })
    }
}