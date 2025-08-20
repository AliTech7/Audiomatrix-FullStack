"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get("token") || ""

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!token) setMessage("Invalid or Missing Token")
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")

        if (password !== confirmPassword) {
            setMessage("Passwords do not match!")
            setLoading(false)
            return
        }

        if (password.length < 6) {
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
                className="w-full max-w-md bg-gray-700 p-6 rounded-lg space-y-4"
            >
                <h2 className="text-xl font-bold text-green-700 text-center">
                    Reset Password
                </h2>
                <p className="text-center text-sm text-white">
                    Enter Your New Password
                </p>

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 pr-10 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-2 pr-10 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

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
