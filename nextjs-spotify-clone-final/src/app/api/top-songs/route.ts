import { client } from '@/sanity/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = `*[_type == "music"] | order(_createdAt desc)[0...5] {
      _id,
      title,
      artist,
      coverImage,
      slug
    }`;
    
    const songs = await client.fetch(query);
    return NextResponse.json(songs);
  } catch (error) {
    console.error('Error fetching top songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top songs' },
      { status: 500 }
    );
  }
} 