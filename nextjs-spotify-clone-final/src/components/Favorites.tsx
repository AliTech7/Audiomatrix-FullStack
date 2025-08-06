'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaHome, FaFilter, FaSort } from "react-icons/fa";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type MusicType = {
  _id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  coverImage?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  artistImage?: {
    _type: "image";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
};

type FavoriteType = {
  _id: string;
  music: MusicType;
  favoritedAt: string;
};

function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchFavorites();
  }, [session, router]);

  const handleRemoveFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      setFavorites(favorites.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const filteredAndSortedFavorites = favorites
    .filter((favorite) => {
      if (filter === "all") return true;
      if (filter === "recent") return true;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.music.title.localeCompare(b.music.title);
      if (sortBy === "artist") return a.music.artist.localeCompare(b.music.artist);
      return new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime();
    });

  if (!session) {
    return null;
  }

  return (
    <div className="flex bg-neutral-900 w-full">
      <div className="w-full px-4 max-w-screen-xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <Link
            href="/"
            className="pl-5 mt-5 text-yellow-400 hover:text-green-600 transition-colors flex items-center"
          >
            <span>🏠</span>
            Back to Home
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row justify-between pr-2 items-center items-start gap-4 sm:gap-0 mb-20 ml-4 px-4 bg-black border border-green-700 rounded-lg w-full max-w-7xl h-auto sm:h-[80px]">
          <h1 className="text-yellow-400 text-xl font-bold mt-4 sm:mt-0">
            Favorite Tracks
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="mb-1 flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full border border-green-700 hover:bg-black transition w-full sm:w-auto">
              <FaFilter className="text-2xl text-yellow-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent border border-green-700 text-white text-sm font-medium cursor-pointer outline-none w-full sm:w-auto"
                aria-label="Filter tracks"
                title="Filter tracks"
              >
                <option value="all" className="bg-neutral-900 text-white">All Tracks</option>
                <option value="recent" className="bg-neutral-900 text-white">Recently Added</option>
                <option value="oldest" className="bg-neutral-900 text-white">Oldest First</option>
              </select>
            </div>

            <div className="mb-1 flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full border border-green-700 hover:bg-black transition w-full sm:w-auto">
              <FaSort className="text-2xl text-yellow-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border border-green-700 text-white text-sm font-medium cursor-pointer outline-none w-full sm:w-auto"
                aria-label="Sort tracks"
                title="Sort tracks"
              >
                <option value="name" className="bg-neutral-900 text-white">Title</option>
                <option value="artist" className="bg-neutral-900 text-white">Artist</option>
                <option value="recent" className="bg-neutral-900 text-white">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAndSortedFavorites.length === 0 ? (
          <div className="flex flex-col justify-center w-full max-w-xl justify-center p-4 sm:p-6 text-center bg-white/5 rounded-lg border-2 border-yellow-400">
            <FaHeart className="text-3xl text-yellow-400 mb-1 opacity-80" />
            <h2 className="text-xl font-bold text-yellow-400 mb-1">No Favorites Yet</h2>
            <p className="text-gray-100">Browse some tracks and add them to your favorites.</p>
          </div>
        ) : (
          <div className="grid ml-2 mr-1 justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-4 sm:gap-y-6 gap-x-2 px-2 mb-2 max-w-screen-xl mx-auto">
            {filteredAndSortedFavorites.map((favorite) => (
              <div
                key={favorite._id}
                className="h-auto h-max-[300px] w-full max-w-[200px] bg-black rounded-lg p-2 transition cursor-pointer relative overflow-hidden hover:translate-y-[-5px] hover:bg-neutral-900 border-2 border-green-700"
              >
                <div className="relative w-full min-w-0 mb-4 rounded-lg overflow-hidden shadow-lg aspect-square">
                  {favorite.music.coverImage && favorite.music.coverImage.asset?._ref ? (
                    <Image
                      src={urlFor(favorite.music.coverImage)?.width(300).height(300).url() || ''}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={favorite.music.title}
                      fill
                      className="object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-300">No Cover</span>
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFavorite(favorite._id)}
                    className="absolute bottom-1 right-1 bg-black/80 rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 hover:bg-black/90 transition"
                    aria-label="Remove from favorites"
                  >
                    <FaHeart className="text-yellow-400 text-xl" />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium text-white truncate">{favorite.music.title}</h3>
                  <p className="text-gray-300 text-sm">{favorite.music.artist}</p>
                  {favorite.music.album && (
                    <p className="text-gray-300 text-sm">Album: {favorite.music.album}</p>
                  )}
                  {favorite.music.releaseDate && (
                    <p className="text-gray-300 text-sm">
                      Released: {new Date(favorite.music.releaseDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorites; 
