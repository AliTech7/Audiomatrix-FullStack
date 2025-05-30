'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaKey } from "react-icons/fa";
import { FaMusic } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import LogoutButton from "@/components/LogoutButton";
import Library from "@/components/Library";
import TopSongsWrapper from "@/components/TopSongsWrapper";
import Image from 'next/image';

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAddMusicClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex h-full bg-neutral-900 text-white">
      <aside className="w-[300px] bg-[#121212] overflow-y-auto">
        <div className="h-full">
          <Library />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="h-full w-full flex flex-col items-center justify-start pt-10 px-4">
          <div className="text-center mb-10 mt-7">
            <h1 className="text-4xl font-bold text-green-700 mb-4">
              Audiomatrix<span className="text-yellow-400 text-4xl">→</span>Your Audio Your Rules
            </h1>
            <p className="text-md text-white">
              Where intelligent tech meets dynamic sound
            </p>
          </div>

          <div className="flex gap-5 rounded-lg overflow-x-auto p-4 mb-7 mt-5">
            <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[270px] w-[245px] flex-shrink-0">
              <Link
                href="/music"
                className="w-[244px] h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700
                hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-1000 ease-in-out cursor-pointer text-yellow-400 text-lg font-semibold"
              >
                <FaMusic className="text-purple-500 text-xl" />
                Browse Music Library
              </Link>
              <div className="relative h-50 items-center justify-center">
                <Image
                  src="/browse-music-library.png"
                  alt="Browse Music"
                  width={220}
                  height={180}
                  className="rounded-md"
                  priority
                />
              </div>
            </div>

            <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[270px] w-[225px] flex-shrink-0">
              <Link
                href={session ? "/music/add" : "#"}
                onClick={handleAddMusicClick}
                className="w-[244px] h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700
                hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-1000 ease-in-out cursor-pointer text-yellow-400 text-lg font-semibold"
              >
                <FaPlus className="text-purple-500 text-xl" />
                Add New Music
              </Link>
              <div className="relative h-50 items-center justify-center">
                <Image
                  src="/add-new-music.png"
                  alt="Music Library"
                  width={180}
                  height={180}
                  className="rounded-md"
                  priority
                />
              </div>
            </div>

            {!session && (
              <>
                <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[270px] w-[225px] flex-shrink-0">
                  <Link
                    href="/auth/login"
                    className="w-[244px] h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700
                    hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-1000 ease-in-out cursor-pointer text-yellow-400 text-lg font-semibold"
                  >
                    <FaKey className="text-purple-500 text-lg" />
                    Log In
                  </Link>
                  <div className="relative h-50 flex items-center justify-center">
                    <Image
                      src="/login.png"
                      alt="Login"
                      width={180}
                      height={180}
                      className="rounded-md"
                      priority
                    />
                  </div>
                </div>

                <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[270px] w-[225px] flex-shrink-0">
                  <Link
                    href="/auth/signup"
                    className="w-[244px] h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700
                    hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-1000 ease-in-out cursor-pointer text-yellow-400 text-lg font-semibold"
                  >
                    👤Sign Up
                  </Link>
                  <div className="relative h-50 flex items-center justify-center">
                    <Image
                      src="/signup.png"
                      alt="Sign Up"
                      width={180}
                      height={180}
                      className="rounded-md"
                      priority
                    />
                  </div>
                </div>
              </>
            )}

            {session && (
              <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[270px] w-[225px] flex-shrink-0">
                <Link
                  href="/profile"
                  className="w-[244px] h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700
                            hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-1000 ease-in-out cursor-pointer text-yellow-400 text-lg font-semibold"
                >
                  👤My Profile
                </Link>
                <div className="relative h-50 flex items-center justify-center">
                  <Image
                    src="/profile.png"
                    alt="Profile"
                    width={180}
                    height={180}
                    className="rounded-md"
                    priority
                  />
                </div>
                <LogoutButton />
              </div>
            )}
          </div>
          <TopSongsWrapper />
        </div>
      </main>
    </div>
  );
}
