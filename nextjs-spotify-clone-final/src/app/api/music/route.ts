import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { serverClient } from '@/lib/sanity';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, artist, album, releaseDate, artistImage } = body;

    const doc = {
      _type: 'music',
      title,
      artist,
      album,
      releaseDate,
      userId: session.user.email,
      slug: {
        _type: 'slug',
        current: title.toLowerCase().replace(/\s+/g, '-'),
      },
      coverImage: artistImage ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: artistImage.assetId.replace('image-', '')
        }
      } : undefined,
      artistImage: artistImage ? {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: artistImage.assetId.replace('image-', '')
        }
      } : undefined
    };

    const result = await serverClient.create(doc);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding music:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 