'use client';

import { serverClient } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity";
import Search from "@/components/Search";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type MusicType = {
  _id: string;
  title: string;
  slug: { current: string };
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
  music: {
    _id: string;
  };
};

export default function MusicPage() {
  const [musicList, setMusicList] = useState<MusicType[]>([]);
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchMusic = async () => {
      const MUSIC_QUERY = `*[_type == "music"]{ 
        _id, 
        title, 
        slug, 
        artist, 
        album,
        releaseDate,
        coverImage {
          _type,
          asset
        },
        artistImage {
          _type,
          asset
        }
      }`;
      
      const music = await serverClient.fetch(MUSIC_QUERY);
      setMusicList(music);
    };

    const fetchFavorites = async () => {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchMusic();
    fetchFavorites();
  }, [session]);

  const handleAddFavorite = async (musicId: string) => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [musicId]: true }));

    const optimisticFavorite = {
      _id: `temp-${musicId}`,
      music: { _id: musicId }
    };
    setFavorites(prev => [...prev, optimisticFavorite]);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ musicId }),
      });

      if (response.ok) {
        const newFavorite = await response.json();
        setFavorites(prev => prev.map(fav => 
          fav._id === `temp-${musicId}` ? newFavorite : fav
        ));
      } else {
        setFavorites(prev => prev.filter(fav => fav._id !== `temp-${musicId}`));
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
      setFavorites(prev => prev.filter(fav => fav._id !== `temp-${musicId}`));
    } finally {
      setLoadingStates(prev => ({ ...prev, [musicId]: false }));
    }
  };

  const isFavorite = (musicId: string) => {
    return favorites.some(fav => fav.music._id === musicId);
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-9xl mx-auto">
        <div className="flex justify-between items-center mb-7">
          <Link
            href="/"
            className="pl-5 text-yellow-400 hover:text-green-600 transition-colors flex items-center"
          >
            <span>🏠</span>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-green-600">🎵Music Library</h1>
        </div>

        <Search musicList={musicList} />

        {musicList.length === 0 ? (
          <p className="text-white">No Music Entries Found.</p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(140px,_1fr))] gap-4">
            {musicList.map((music) => {
              const artistImageUrl = urlFor(music.artistImage)?.url();
              const isFavorited = isFavorite(music._id);
              const isLoading = loadingStates[music._id];
              
              return (
                <div
                  key={music._id}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg h-[320px] w-full relative hover:translate-y-[-3px]"
                >
                  <div className="relative h-48">
                    {music.artistImage ? (
                      <Image
                        src={urlFor(music.artistImage)?.width(300).height(300).url() || ''}
                        alt={music.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-300">No Cover Image</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleAddFavorite(music._id)}
                      disabled={isLoading}
                      className={`absolute bottom-1 right-1 bg-black/80 rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 hover:bg-black/90 transition ${
                        isFavorited ? 'text-yellow-400' : 'text-green-600'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                      <FaHeart className={`text-xl ${isLoading ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>
                  <div className="p-3">
                    <div>
                      <h2 className="text-xl font-semibold">{music.title}</h2>
                      <p className="text-gray-300">{music.artist}</p>
                    </div>
                    {music.album && (
                      <p className="text-gray-400 text-sm mb-1">Album: {music.album}</p>
                    )}
                    {music.releaseDate && (
                      <p className="text-gray-400 text-sm">
                        Date: {new Date(music.releaseDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
