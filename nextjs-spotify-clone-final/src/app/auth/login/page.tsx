'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email: formData.email });

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (!result) {
        throw new Error('No response from authentication server');
      }

      if (result.error) {
        console.error('Authentication error:', result.error);
        setError(result.error === 'CredentialsSignin'
          ? 'Invalid email or password'
          : result.error);
        return;
      }

      if (result.ok) {
        console.log('Login successful, redirecting...');
        router.push('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 relative pb-5">
      <div className="flex flex-col space-y-4">
        <Link
          href="/"
          className="mb-3 p-3 text-yellow-400 text-md font-semibold flex items-center gap-1 hover:text-[#1ed760] transition-colors"
        >
          <span>🏠</span>
          Back to Home
        </Link>
      </div>

      <div className="max-w-2xl w-full space-y-8 p-8 bg-[#181818] rounded-lg">
        <div className="flex flex-col space-y-4">
          <div className="bg-[#181818] text-white p-3 rounded-lg text-center">
            <p className="text-xs text-blue-400 font-medium">
              Please log in to access this feature!
            </p>
          </div>
          <h2 className="text-xl font-extrabold text-green-700 text-center mb-2">
            Log in to your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500 text-white p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="text-md font-bold text-white">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-md font-bold text-white">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-sm text-right mt-1">
              <Link
                href="/auth/forgot-password"
                className="text-blue-400 hover:text-white transition-colors"
              >
                Forgot Password!
              </Link>
            </div>

            <div className="text-sm">
              <Link
                href="/auth/signup"
                className="text-blue-400 hover:text-white transition-colors"
              >
                Don&apos;t have an account? Sign up
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
