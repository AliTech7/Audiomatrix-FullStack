'use client';

import React, { useState } from "react";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";

type MusicType = {
  _id: string;
  title: string;
  artist: string;
  artistImage?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
};

interface SearchProps {
  musicList: MusicType[];
}

function Search({ musicList }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMusic = searchTerm.trim() === ""
    ? []
    : musicList.filter((music) =>
        music.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        music.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="p-5 bg-neutral-900 rounded-lg mb-6">
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search for Artists..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 bg-[#242424] border border-yellow-400 rounded-xl text-white text-base placeholder-gray-400 focus:outline-none focus:bg-[#2a2a2a]"
        />
      </div>

      {filteredMusic.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-5 py-5">
          {filteredMusic.map((music) => (
            <div
              key={music._id}
              className="bg-[#181818] p-4 rounded-lg transition-colors hover:bg-[#282828] cursor-pointer"
            >
              <div className="relative w-full aspect-square mb-4">
                {music.artistImage ? (
                  <Image
                    src={urlFor(music.artistImage)?.width(300).height(300).url() || ''}
                    alt={music.artist}
                    fill
                    sizes="180px"
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <span className="text-white text-base font-semibold block text-center">
                {music.artist}
              </span>
              <span className="text-gray-400 text-sm block text-center">
                {music.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
