'use client';

import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/imageUrlBuilder';

interface Song {
  _id: string;
  title: string;
  artist: string;
  coverImage: any;
  slug: {
    current: string;
  };
}

interface TopSongsProps {
  initialSongs: Song[];
}

export default function TopSongs({ initialSongs }: TopSongsProps) {
  // Empty State
  if (initialSongs.length === 0) {
    return (
      <div className="w-full px-4 py-4">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">Top Songs</h2>
        <div className="text-gray-400 bg-black/40 p-3 rounded-lg text-sm">
          No songs available yet!
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="w-full px-4 py-4">
      <h2 className="text-2xl font-bold text-yellow-400 mb-5 text-center">Top Songs</h2>
      <div className="flex justify-center gap-3">
        {initialSongs.map((song) => (
          <Link
            href={`/music/${song.slug.current}`}
            key={song._id}
            className="bg-black/40 p-2 rounded-lg hover:bg-black/70 hover:translate-y-[-3px] transition-all duration-300 w-full sm:w-[180px] max-w-xs"
          >
            <div className="relative w-full aspect-square mb-1">
              <Image
                src={urlFor(song.coverImage)?.url() || ''}
                alt={song.title}
                fill
                className="object-cover rounded-md"
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h3 className="text-white text-md font-semibold truncate">{song.title}</h3>
            <p className="text-gray-400 text-sm sm:text-[14px] truncate">{song.artist}</p>
          </Link>
        ))}
      </div>
    </div>
  );
} 
