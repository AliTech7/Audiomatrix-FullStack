"use client"

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPassword() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token") || ""

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!")
            setLoading(false)
            return
        }

        //Checking Minimum Password Length
        if(password.length < 6) {
            setMessage("Password must be at least 6 characters!")
            setLoading(false)
            return
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            })

            const data = await res.json()
            setMessage(data.message)
            if (res.ok) {
                setTimeout(() => router.push("/auth/login"), 3000)
            }
        } catch (err) {
            setMessage("An error occurred. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-gray-800 p-6 rounded-lg space-y-4"
            >
                <h2 className="text-xl font-bold text-green-700 text-center">
                    Reset Password
                </h2>
                <p className="text-center text-sm text-gray-400">
                    Enter Your New Password
                </p>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
                {message && (
                    <p className="text-center text-sm text-green-400 mt-2">{message}</p>
                )}
            </form>
        </div>
    )
}
