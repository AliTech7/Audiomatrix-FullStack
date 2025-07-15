import React from "react";
import { LuLibrary } from "react-icons/lu";
import { IoAddOutline } from "react-icons/io5";
import { GrLanguage } from "react-icons/gr";
import { FaHeart } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import Link from "next/link";

function Library() {
  return (
    <div className="w-full h-full bg-black">
      <div className="px-4 py-2">
        <div className="flex flex-wrap justify-between text-[#a7a7a7]">
          <div className="grid grid-flow-col items-center justify-start text-base px-2 py-1">
            <LuLibrary className="text-2xl" />
            Your Library
          </div>
          <IoAddOutline className="text-2xl" aria-label="Add icon" />
        </div>
      </div>

      <div className="px-2 pb-2">
        <div className="bg-[#242424] px-5 py-4 my-2 flex flex-col items-start rounded-lg text-white">
          <p className="font-semibold text-sm">Create Your Favorite Playlist</p>
          <Link
            href="/favorites"
            className="mt-4 text-sm font-semibold px-4 py-1.5 bg-black text-yellow-400 rounded-full border-2 border-green-700 hover:text-green-700 transition-colors duration-300 flex items-center gap-1"
            aria-label="View Favorites"
          >
            <FaHeart />
            Favorite Tracks
          </Link>
        </div>

        <div className="bg-[#242424] px-5 py-4 mt-6 rounded-lg flex flex-col items-start text-white rounded-t-lg text-sm">
          Let's Find Some Podcasts
        </div>
      </div>

      <div className="flex flex-col mt-4 px-6 items-start">
        <div
          className="flex items-center gap-1 px-3 py-1.5 border border-[#878787] bg-black text-yellow-400 text-sm rounded-full mb-3"
        >
          <GrLanguage />
          English
        </div>
        <Link
          href="/about"
          className="flex items-center gap-1 px-3 py-1.5 mt-3 border border-[#878787] bg-black text-yellow-400 text-sm rounded-full hover:text-green-700 transition-colors duration-300"
          aria-label="About"
        >
          <IoInformationCircleOutline />
          About
        </Link>
      </div>
    </div>
  );
}

export default Library;
