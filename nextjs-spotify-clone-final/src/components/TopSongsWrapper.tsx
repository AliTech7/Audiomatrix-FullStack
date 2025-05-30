'use client';

import { useEffect, useState } from 'react';
import TopSongs from './TopSongs';

interface Song {
  _id: string;
  title: string;
  artist: string;
  coverImage: any;
  slug: {
    current: string;
  };
}

export default function TopSongsWrapper() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('/api/top-songs');
        if (!response.ok) throw new Error('Failed to fetch songs');
        const data = await response.json();
        setSongs(data);
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full px-4 py-4">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Top Recent Songs</h2>
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-black/40 p-2 rounded-lg animate-pulse w-[100px]">
              <div className="w-full aspect-square bg-gray-700 rounded-md mb-1" />
              <div className="h-2 bg-gray-700 rounded w-3/4 mb-1" />
              <div className="h-2 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-4">
        <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Top Recent Songs</h2>
        <div className="text-red-500 bg-red-100/10 p-3 rounded-lg text-sm">
          {error}
        </div>
      </div>
    );
  }

  return <TopSongs initialSongs={songs} />;
} 