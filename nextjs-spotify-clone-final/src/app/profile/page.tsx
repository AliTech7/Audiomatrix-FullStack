"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { urlFor } from "@/lib/sanity"

interface UserProfile {
    name: string
    email: string
    createdAt: string
}

interface Music {
    _id: string
    title: string
    artist: string
    album: string
    releaseDate: string
    coverImage?: {
        _type: "image"
        asset: {
            _ref: string
            _type: "reference"
        }
    }
}

export default function Profile() {
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [music, setMusic] = useState<Music[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/profile")
                if (!response.ok) throw new Error("Failed to load profile")
                const data = await response.json()
                setProfile(data.profile)
                setMusic(data.music)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load profile")
                router.push("/auth/login")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [router])

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/" })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-green-600 text-lg">Loading your profile...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900">
                <div className="text-red-500 text-center">
                    <p className="text-xl mb-4">{error}</p>
                    <button
                        onClick={() => router.push("/auth/login")}
                        className="px-4 py-2 bg-black text-yellow-400 hover:text-green-700 transition-colors rounded-lg border-2 border-green-700"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-900">
            <div className="max-w-5xl mx-auto px-4 py-5">
                <div className="flex justify-between items-center mb-7">
                    <Link href="/" className="text-yellow-400 hover:text-green-600 transition-colors">
                        <span>🏠</span>Back to Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-black text-md text-yellow-400 hover:text-green-700 transition-colors rounded-lg border-2 border-green-700"
                    >
                        Logout
                    </button>
                </div>

                <div className="bg-[#181818] rounded-lg p-7 mb-4 border-2 border-green-700">
                    <h1 className="text-2xl font-bold text-green-600 mb-10">Profile</h1>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-purple-700 text-md font-medium mb-1">Name</label>
                            <div className="bg-[#181818] text-white p-3 rounded-md">{profile?.name}</div>
                        </div>
                        <div>
                            <label className="block text-purple-700 text-md font-medium mb-1">Email</label>
                            <div className="bg-[#181818] text-white p-3 rounded-md">{profile?.email}</div>
                        </div>
                        <div>
                            <label className="block text-purple-700 text-md font-medium mb-1">Member Since</label>
                            <div className="bg-[#181818] text-white p-3 rounded-md">
                                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-neutral-900 p-4">
                <div className="flex justify-between items-center mb-7 max-w-7xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-green-600">My Music</h2>
                    <Link
                        href="/music/add"
                        className="bg-black hover:text-green-700 text-yellow-400 px-4 py-2 mr-12 rounded-lg transition-colors border-2 border-green-700"
                    >
                        Add New Music
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto px-4">
                    {music.length === 0 ? (
                        <div className="text-gray-400 text-center py-8">
                            You haven&apos;t added any music yet. Click &quot;Add New Music&quot; to get started!
                        </div>
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))] gap-3">
                            {music.map((item) => {
                                const imageUrl = item.coverImage
                                    ? urlFor(item.coverImage)?.width(300).height(300).url()
                                    : undefined

                                return (
                                    <div key={item._id} className="h-[260px] bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors">
                                        <div className="relative h-40 w-full">
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={item.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover rounded-t-lg"
                                                    priority
                                                    quality={75}
                                                    loading="eager"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement
                                                        target.style.display = 'none'
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-500 flex items-center justify-center rounded-t-lg">
                                                    <span className="text-gray-300">No Image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="text-white font-semibold truncate">{item.title}</h3>
                                            <p className="text-gray-300 text-sm truncate">{item.artist}</p>
                                            {item.album && (
                                                <p className="text-gray-400 text-sm truncate">{item.album}</p>
                                            )}
                                            {item.releaseDate && (
                                                <p className="text-gray-400 text-sm truncate">
                                                    {new Date(item.releaseDate).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
