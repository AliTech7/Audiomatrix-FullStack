"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"


export default function UserPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login")
        } else if (status === "authenticated") {
            setLoading(false)
        }
    }, [status, router])

    if (loading) {
        return <div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>
    }

    if (!session?.user) {
        return <div className="min-h-screen bg-gray-900 text-white p-8">No User Data Available!</div>
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                    >
                        <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        >
                            <path 
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                            />
                        </svg>
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold">User Profile</h1>
                </div>
                <div className="bg-gray-800 p-6 rouded-lg">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Name</h2>
                        <p className="text-gray-300">{session.user.name}</p>
                    </div>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Email</h2>
                    <p className="text-gray-300">{session.user.email}</p>
                </div>
                {session.user.createdAt && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Account Created</h2>
                        <p className="text-gray-300">
                            {new Date(session.user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                )}
                </div>
            </div>
        </div>
    )
}
