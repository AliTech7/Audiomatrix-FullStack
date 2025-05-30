import { client } from '@/sanity/client';
import TopSongs from './TopSongs';

async function getTopSongs() {
  const query = `*[_type == "music"] | order(_createdAt desc)[0...5] {
    _id,
    title,
    artist,
    coverImage,
    slug
  }`;
  
  return client.fetch(query);
}

export default async function TopSongsSection() {
  const topSongs = await getTopSongs();
  return <TopSongs initialSongs={topSongs} />;
} 