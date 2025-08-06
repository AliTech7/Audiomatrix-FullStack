'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AddMusicPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    releaseDate: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError('You must be logged in to add music');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First, upload the image if it exists
      let imageData = null;
      if (coverImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', coverImage);

        const imageResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadedImageData = await imageResponse.json();
        imageData = {
          assetId: uploadedImageData.assetId,
          url: uploadedImageData.url
        };
      }

      // Then create the music entry
      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.email,
          artistImage: imageData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('This song by this artist already exists in the library. Please try a different title or artist.');
        } else {
          throw new Error(data.error || 'Failed to add music');
        }
        return;
      }

      router.push('/music');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add music');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-[#181818] text-white px-4 py-6 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-80">

            <Link
              href="/"
              className="text-yellow-400 text-md hover:text-green-600 transition-colors flex items-center px-2 py-1 border-yellow-400 rounded hover:border-green-600"
            >
              <span>🏠</span>
              Back to Home
            </Link>

            <Link
              href="/music"
              className="text-yellow-400 text-md hover:text-green-600 transition-colors flex items-center px-2 py-1 border border-green-700 rounded hover:border-green-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Music Library
            </Link>

          </div>
        </div>

        <h1 className="text-3xl sm:text-3xl font-bold text-green-600 text-center pt-5">Add New Music</h1>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="w-full mt-8 px-2 sm:px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-md font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 bg-gray-700 rounded-md text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter song title"
              />
            </div>
            <div>
              <label htmlFor="artist" className="block text-md font-medium mb-1">
                Artist <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="artist"
                name="artist"
                value={formData.artist}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 bg-gray-700 rounded-md text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter artist name"
              />
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-md font-medium mb-1">
                Cover Image
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-3 bg-gray-700 rounded-md text-white"
                />
                {coverImagePreview && (
                  <div className="relative w-20 h-20">
                    <Image
                      src={coverImagePreview}
                      alt="Cover preview"
                      fill
                      sizes="80px"
                      className="object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="album" className="block text-md font-medium mb-1">
                Album
              </label>
              <input
                type="text"
                id="album"
                name="album"
                value={formData.album}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-gray-700 rounded-md text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Enter album name"
              />
            </div>
            <div>
              <label htmlFor="releaseDate" className="block text-md font-medium mb-1">
                Release Date
              </label>
              <input
                type="date"
                id="releaseDate"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                className="w-full px-3 py-3 bg-gray-700 rounded-md text-white border border-gray-700 placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Music'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
} 