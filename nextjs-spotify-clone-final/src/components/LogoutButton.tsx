"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"

export default function LogoutButton() {
    const { data: session } = useSession()

    if (!session) {
        return (
            <div className="flex space-x-4">
                <Link
                    href="/auth/login"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Login
                </Link>
                <Link
                    href="/auth/signup"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-600 transition-colors"
                >
                    Sign Up
                </Link>
            </div>
        )
    }

    return (
        <div className="flex items-center space-x-4">
            <Link
                href="/profile"
                className="text-green-700 text-lg font-semibold hover:text-green-700 transition-colors"
            >
                {session.user?.name}
            </Link>
            <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 bg-black/60 text-yellow-400 font-semibold border-2 border-green-700 
                           rounded-lg hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl 
                           transition duration-700 ease-in-out text-md"
            >
                Logout
            </button>
        </div>
    )
}
