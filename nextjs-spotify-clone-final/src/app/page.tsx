'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaKey, FaMusic, FaPlus } from "react-icons/fa";
import LogoutButton from "@/components/LogoutButton";
import Library from "@/components/Library";
import TopSongsWrapper from "@/components/TopSongsWrapper";
import Image from 'next/image';
import { useState } from "react";
import React from "react";
import { FaBars, FaTimes } from "react-icons/fa"

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // Add toggle state
  const [showLibrary, setShowLibrary] = useState(false); // Default to false for mobile

  // Detect screen size for sidebar default
  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only allow toggling on mobile, always show on desktop & laptop!
  React.useEffect(() => {
    if (!isMobile) {
      setShowLibrary(true);
    } else {
      setShowLibrary(false);
    }
  }, [isMobile]);

  const handleAddMusicClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      router.push('/auth/login');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen bg-neutral-900 text-white relative">

      {/* Top right Log Out */}
      {session && (
        <div className="absolute top-15 md:top-6 right-4 md:right-6 z-50 mt-2 mb-5">
          <LogoutButton />
        </div>
      )}

      {/* Sidebar Toggle Button-only for mobile */}
      {isMobile && (
        <button
          onClick={() => setShowLibrary(prev => !prev)}
          className="fixed top-4 left-4 z-50 p-2 bg-zinc-800 text-white rounded-md md:hidden shadow-lg focus:outline-none focus:ring-2 focus:ring-green-700"
          aria-label="Toggle Library"
        >
          {showLibrary ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      )}

      {/* Sidebar Backdrop for mobile */}
      {showLibrary && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setShowLibrary(false)}
        />
      )}

      {/* Sidebar-overlays on mobile, static on desktop */}
      <aside
        className={`
    bg-[#121212] overflow-y-auto min-h-screen
    ${isMobile
            ? `fixed top-0 left-0 z-50 w-4/5 max-w-xs transition-transform duration-300 ease-in-out ${showLibrary ? 'translate-x-0' : '-translate-x-full'}`
            : 'static z-0 w-[300px]'}
  `}
      >
        <Library />
      </aside>


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-h-screen flex flex-col">
        {/* Header */}
        <div className="w-full flex flex-col items-center pt-6 md:pt-8 px-2 sm:px-4">
          <div className="text-center mb-4 mt-2 sm:mt-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700 mb-2 sm:mb-4">
              Audiomatrix<span className="text-yellow-400 text-2xl sm:text-4xl">→</span>Your Audio Your Rules
            </h1>
            <p className="text-md sm:text-md text-white">
              Where intelligent tech meets dynamic sound
            </p>
          </div>
        </div>

        {/* Cards Section */}
        <section className="w-full flex justify-center mt-5">
          <div className="flex gap-4 sm:gap-5 overflow-x-auto md:overflow-x-visible md:flex-wrap p-2 sm:p-4 mt-0 mb-8 max-w-5xl scroll-snap-x snap-mandatory justify-center">

            {/* Add Music Card */}
            <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[220px] sm:h-[270px] w-[180px] sm:w-[225px] flex-shrink-0">
              <Link
                href={session ? "/music/add" : "#"}
                onClick={handleAddMusicClick}
                className="w-full h-[70px] sm:h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700 hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-700 ease-in-out cursor-pointer text-yellow-400 text-base sm:text-lg font-semibold"
              >
                <FaPlus className="text-purple-500 text-lg sm:text-xl" />
                Add New Music
              </Link>
              <div className="relative flex items-center justify-center px-2 pt-2">
                <Image
                  src="/add-new-music.png"
                  alt="Music Library"
                  width={180}
                  height={120}
                  className="rounded-md w-full h-auto max-w-[140px] sm:max-w-[180px]"
                  priority
                />
              </div>
            </div>

            {/* Browse Music Library Card */}
            <div className="bg-black border-2 border-yellow-600 rounded-lg overflow-hidden shadow-lg h-[220px] sm:h-[270px] w-[180px] sm:w-[225px] md:max-w-[245px] flex-shrink-0">
              <Link
                href="/music"
                className="w-full h-[70px] sm:h-[90px] bg-black/60 flex items-center justify-center gap-2 border-b-2 border-green-700 hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-700 ease-in-out cursor-pointer text-yellow-400 text-base sm:text-md font-semibold"
              >

                Browse Music Library
              </Link>
              <div className="relative flex items-center justify-center px-2 pt-2">
                <Image
                  src="/browse-music-library.png"
                  alt="Browse Music"
                  width={140}
                  height={120}
                  className="rounded-md w-full h-auto max-w-[180px] sm:max-w-[220px]"
                  priority
                />
              </div>
            </div>

            {/* Guest Only: Log In/Sign Up */}
            {!session && (
              <>
                {/* Log In */}
                <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[220px] sm:h-[270px] w-[180px] sm:w-[225px] flex-shrink-0">
                  <Link
                    href="/auth/login"
                    className="w-full h-[70px] sm:h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700 hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-700 ease-in-out cursor-pointer text-yellow-400 text-base sm:text-lg font-semibold"
                  >
                    <FaKey className="text-purple-500 text-base sm:text-lg" />
                    Log In
                  </Link>
                  <div className="relative flex items-center justify-center px-2 pt-2">
                    <Image
                      src="/login.png"
                      alt="Login"
                      width={140}
                      height={120}
                      className="rounded-md h-auto max-w-[140px] sm:max-w-[180px]"
                      priority
                    />
                  </div>
                </div>

                {/* Sign Up */}
                <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[220px] sm:h-[270px] w-[180px] sm:w-[225px] flex-shrink-0">
                  <Link
                    href="/auth/signup"
                    className="w-full h-[70px] sm:h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700 hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-700 ease-in-out cursor-pointer text-yellow-400 text-base sm:text-lg font-semibold"
                  >
                    👤Sign Up
                  </Link>
                  <div className="relative flex items-center justify-center px-2 pt-2">
                    <Image
                      src="/signup.png"
                      alt="Sign Up"
                      width={140}
                      height={120}
                      className="rounded-md w-full h-auto max-w-[140px] sm:max-w-[180px]"
                      priority
                    />
                  </div>
                </div>
              </>
            )}

            {/* Logged in User: Profile */}
            {session && (
              <div className="bg-black border-2 border-green-700 rounded-lg overflow-hidden shadow-lg h-[220px] sm:h-[270px] w-[180px] sm:w-[225px] flex-shrink-0">
                <Link
                  href="/profile"
                  className="w-full h-[70px] sm:h-[90px] bg-black/60 flex items-center justify-center gap-1 border-b-2 border-green-700 hover:bg-purple-950 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl transition duration-700 ease-in-out cursor-pointer text-yellow-400 text-base sm:text-lg font-semibold"
                >
                  👤My Profile
                </Link>
                <div className="relative flex items-center justify-center px-2 pt-2">
                  <Image
                    src="/profile.png"
                    alt="Profile"
                    width={140}
                    height={120}
                    className="rounded-md w-full h-auto max-w-[140px] sm:max-w-[180px]"
                    priority
                  />
                </div>
                <LogoutButton />
              </div>
            )}
          </div>
        </section>

        {/* Top Songs Section */}
        <section className="w-full flex justify-center mt-5">
          <div className="w-full max-w-4xl px-1 sm:px-4">
            <TopSongsWrapper />
          </div>
        </section>
      </main>
    </div>
  );
}
