import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Initializing Sanity Client
const client = createClient({
    projectId: "584oofht",
    dataset: "production",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: "2025-08-16",
});

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASS,
    }
})

export async function POST(req: NextRequest) {
    console.log("Forgot password POST called")
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        // Finding User by Email
        const query = `*[_type=="user" && email == $email]`;
        const users = await client.fetch(query, { email });

        if (!users || users.length === 0) {
            return NextResponse.json({
                message: "If your email exists, a reset link was sent",
            });
        }

        const user = users[0];

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpires = Date.now() + 3600 * 1000; // 1 hour

        // Updating User in Sanity
        await client
            .patch(user._id)
            .set({
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetExpires,
            })
            .commit();

        console.log(`Reset token for ${email}: ${resetToken}`); // For Local Testing

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`

        // Sending Email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Audiomatrix Password Reset",
            html: `
            <p>Hello,</p>
            <p>You requsted a password reset.</p>
            <p>Click this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>
            <p>If you did not request this, ignore this email.</p>`
        })

        return NextResponse.json({
            message: "If your email exists, a reset link was sent",
        });
    } catch (err) {
        console.error("Forgot password error:", err);
        return NextResponse.json(
            { message: "An error occurred. Please try again later." },
            { status: 500 }
        );
    }
}
