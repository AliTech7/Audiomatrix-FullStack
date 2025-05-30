import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { serverClient } from '@/lib/sanity';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Deleting the music document
    await serverClient.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing music:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 