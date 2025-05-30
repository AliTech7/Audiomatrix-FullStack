'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AddMusicForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    releaseDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setError('You must be logged in to add music');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: session.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add music');
      }

      router.refresh();
      setFormData({
        title: '',
        artist: '',
        album: '',
        releaseDate: '',
      });
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
    <div className="bg-gray-800 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-bold mb-4">Add New Music</h2>
      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
          />
        </div>
        <div>
          <label htmlFor="artist" className="block text-sm font-medium mb-1">
            Artist
          </label>
          <input
            type="text"
            id="artist"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
          />
        </div>
        <div>
          <label htmlFor="album" className="block text-sm font-medium mb-1">
            Album
          </label>
          <input
            type="text"
            id="album"
            name="album"
            value={formData.album}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
          />
        </div>
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium mb-1">
            Release Date
          </label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 rounded text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Music'}
        </button>
      </form>
    </div>
  );
} 