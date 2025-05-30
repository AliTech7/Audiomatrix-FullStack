'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Raw password sent
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Something went wrong');
      }

      // Auto sign in after successful signup
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
    <div className="min-h-screen h-full flex flex-col items-center justify-center bg-neutral-900 text-white pb-5">
      
      <div className="flex flex-col space-y-4">
        <Link
          href="/"
          className="mb-3 p-3 text-yellow-400 text-md font-semibold flex items-center gap-1 hover:text-[#1ed760] transition-colors"
        >
          <span>🏠</span>
          Back to Home
        </Link>
      </div>

      <div className="bg-[#181818] p-8 rounded-lg w-full max-w-2xl shadow-lg">
        {error && (
          <div className="text-red-500 bg-red-500/10 p-3 rounded-md mb-6 text-center text-base">
            {error}
          </div>
        )}

        <h2 className="text-xl font-extrabold text-green-700 text-center mb-4">
          Create your account
        </h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-md font-bold">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-md font-bold">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-md font-bold">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white p-3 rounded-xl text-md font-bold hover:bg-[#1ed760] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
}
