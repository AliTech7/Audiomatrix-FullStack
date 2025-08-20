'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()
            setMessage(data.message)
        } catch (err) {
            setMessage("An error occurred. Please try again later.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative bg-neutral-900 text-white">

            {/* Back to Log in Page */}
            <div className="absolute top-7 left-7 border border-1 border-green-700 rounded p-2">
                <Link
                    href="/auth/login"
                    className="text-md text-yellow-400 hover:text-green-600">
                    Back to Log In
                </Link>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-gray-800 p-6 rounded-lg space-y-4"
            >
                <h2 className="text-xl font-bold text-green-700 text-center">
                    Forgot Password
                </h2>
                <p className="text-center text-sm text-gray-300">
                    Enter your email to receive a password reset link!
                </p>
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-white disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                {message && (
                    <p className="text-center text-sm text-green-400 mt-2">{message}</p>
                )}
            </form>
        </div>

    )
}
